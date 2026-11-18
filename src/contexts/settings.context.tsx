
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Appearance,
    I18nManager,
} from "react-native";

import * as Updates from "expo-updates";

import {
    translations,
    type Language,
    type TranslationKey,
} from "@/constants/translations";

type Theme = "light" | "dark";

interface SettingsContextType {
  theme: Theme;
  language: Language;
  isReady: boolean;

  setTheme: (theme: Theme) => Promise<void>;
  setLanguage: (language: Language) => Promise<void>;

  t: (key: TranslationKey) => string;
}

const THEME_STORAGE_KEY = "@pdf-library/theme";
const LANGUAGE_STORAGE_KEY = "@pdf-library/language";

const SettingsContext = createContext<
  SettingsContextType | undefined
>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({
  children,
}: SettingsProviderProps) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [language, setLanguageState] = useState<Language>("en");
  const [isReady, setIsReady] = useState(false);

  // تحميل الإعدادات المحفوظة عند تشغيل التطبيق
  useEffect(() => {
    async function loadSettings() {
      try {
        const [savedTheme, savedLanguage] = await Promise.all([
          AsyncStorage.getItem(THEME_STORAGE_KEY),
          AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
        ]);

        const initialTheme: Theme =
          savedTheme === "dark" ? "dark" : "light";

        const initialLanguage: Language =
          savedLanguage === "ar" ? "ar" : "en";

        setThemeState(initialTheme);
        setLanguageState(initialLanguage);

        Appearance.setColorScheme(initialTheme);

        const shouldBeRTL = initialLanguage === "ar";

        I18nManager.allowRTL(true);
        I18nManager.forceRTL(shouldBeRTL);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsReady(true);
      }
    }

    loadSettings();
  }, []);

  // تغيير الثيم وحفظه
  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);

      setThemeState(newTheme);
      Appearance.setColorScheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, []);

  // تغيير اللغة وحفظها
  const setLanguage = useCallback(
    async (newLanguage: Language) => {
      try {
        await AsyncStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          newLanguage
        );

        const wasRTL = language === "ar";
        const willBeRTL = newLanguage === "ar";

        setLanguageState(newLanguage);

        if (wasRTL !== willBeRTL) {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(willBeRTL);

          await Updates.reloadAsync();
        }
      } catch (error) {
        console.error("Failed to change language:", error);
      }
    },
    [language]
  );

  // ترجمة النص حسب اللغة الحالية
  const t = useCallback(
    (key: TranslationKey) => {
      return translations[language][key];
    },
    [language]
  );

  return (
    <SettingsContext.Provider
      value={{
        theme,
        language,
        isReady,
        setTheme,
        setLanguage,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}


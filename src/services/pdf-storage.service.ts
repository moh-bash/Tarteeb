import { Directory, File, Paths } from "expo-file-system";

const pdfDirectory = new Directory(Paths.document, "pdf-library");

function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "document.pdf";
}

export async function savePdfFile(
  sourceFile: File,
  originalName: string,
): Promise<string> {
  try {
    if (!pdfDirectory.exists) {
      pdfDirectory.create({
        idempotent: true,
        intermediates: true,
      });
    }

    const uniqueName = `${Date.now()}-${sanitizeFileName(originalName)}`;
    const destinationFile = new File(pdfDirectory, uniqueName);

    await sourceFile.copy(destinationFile);

    return destinationFile.uri;
  } catch (error) {
    console.error("PDF storage error:", error);
    throw error;
  }
}

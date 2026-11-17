import type { SQLiteDatabase } from "expo-sqlite";

import type { CreateSubjectInput, Subject } from "../types";

export async function getSubjects(db: SQLiteDatabase): Promise<Subject[]> {
  return db.getAllAsync<Subject>(
    "SELECT * FROM subjects ORDER BY created_at DESC",
  );
}

export async function createSubject(
  db: SQLiteDatabase,
  input: CreateSubjectInput,
): Promise<number> {
  const result = await db.runAsync(
    "INSERT INTO subjects (name, color) VALUES (?, ?)",
    input.name.trim(),
    input.color ?? "#2563EB",
  );

  return result.lastInsertRowId;
}

export async function deleteSubject(
  db: SQLiteDatabase,
  id: number,
): Promise<void> {
  await db.runAsync("DELETE FROM subjects WHERE id = ?", id);
}

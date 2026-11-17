
import type { SQLiteDatabase } from "expo-sqlite";

import type { Group, CreateGroupInput } from "../types";

export async function getGroups(
  db: SQLiteDatabase,
  subjectId: number
): Promise<Group[]> {
  return db.getAllAsync<Group>(
    `SELECT * FROM groups
     WHERE subject_id = ?
     ORDER BY created_at DESC`,
    subjectId
  );
}

export async function createGroup(
  db: SQLiteDatabase,
  input: CreateGroupInput
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO groups (subject_id, name)
     VALUES (?, ?)`,
    input.subject_id,
    input.name.trim()
  );

  return result.lastInsertRowId;
}

export async function deleteGroup(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync(
    "DELETE FROM groups WHERE id = ?",
    id
  );
}

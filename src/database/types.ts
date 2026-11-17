// Subjects
export interface Subject {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface CreateSubjectInput {
  name: string;
  color?: string;
}

// Groups
export interface Group {
  id: number;
  subject_id: number;
  name: string;
  created_at: string;
}

export interface CreateGroupInput {
  subject_id: number;
  name: string;
}

// Documents

export interface Document {
  id: number;
  group_id: number;
  title: string;
  file_uri: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface CreateDocumentInput {
  group_id: number;
  title: string;
  file_uri: string;
  file_size: number;
  mime_type?: string;
}

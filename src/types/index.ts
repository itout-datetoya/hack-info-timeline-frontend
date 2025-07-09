export interface Tag {
  id: string;
  name: string;
}

export interface Incident {
  id: string;
  title: string;
  summary: string;
  source_url: string;
  reported_at: string; // ISO 8601 形式の文字列
  tags: Tag[] | null;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  sentiment: string | null;
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  title: string;
  content: string;
}

export interface NoteAnalysis {
  sentiment: string;
}

export type SentimentType = 'positive' | 'neutral' | 'negative'; 
// Minimal shared types used across the app
export interface Activity {
  id: string;
  title: string;
  description?: string;
  image?: string; // URL or imported asset
  date?: string; // human-readable date or ISO string
  time?: string;
  location?: string;
  status: 'registered' | 'open' | 'completed' | string;
}

export type Activities = Activity[];

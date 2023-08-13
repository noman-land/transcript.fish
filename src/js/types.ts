export interface Episode {
  image: string;
  description: string;
  duration: number;
  episode: number;
  title: string;
  pubDate: string;
  wordCount: number;
  presenter1: number;
  presenter2: number;
  presenter3: number;
  presenter4: number;
  presenter5: number;
  venue: number;
  live: number;
  compilation: number;
}

export interface Word {
  startTime: number;
  endTime: number;
  word: string;
  probability: number;
}

export type SearchField = 'episode' | 'title' | 'description' | 'words';

export type FiltersState = {
  [k in SearchField]: boolean;
};

export interface FilterBarProps {
  filters: FiltersState;
  onToggle: (args: { name: string; checked: boolean }) => void;
}

export type SelectEpisodeWords = (episode: number) => Promise<Word[]>;

export interface SearchEpisodeWordsResult {
  episode: number;
}

export type SearchEpisodeWords = (
  searchTerm: string,
  filters: FiltersState
) => Promise<SearchEpisodeWordsResult[]>;

export type SearchResults = Record<number, boolean>;

export type Hosts = 'dan' | 'james' | 'anna' | 'andy';

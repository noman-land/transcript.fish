export interface Episode {
  image: string;
  description: string;
  duration: number;
  episode: number;
  title: string;
  pubDate: string;
  wordCount: number;
}

export interface Word {
  startTime: number;
  endTime: number;
  word: string;
  probability: number;
}

export type SearchField = 'episode' | 'title' | 'description';

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
  searchTerm: string
) => Promise<SearchEpisodeWordsResult[]>;

export type SearchResults = Record<number, boolean>;

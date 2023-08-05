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
export type SearchFunction = (ep: Episode, searchTerm: string) => boolean;
export type SearchFunctions = {
  [k in SearchField]: SearchFunction;
};

export type FiltersState = {
  [k in SearchField]: boolean;
};

export interface FilterBarProps {
  filters: FiltersState;
  onToggle: (args: { name: string; checked: boolean }) => void;
}

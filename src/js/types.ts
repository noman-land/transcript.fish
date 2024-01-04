export interface Presenter {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  qiElf: string;
  guest: string;
}

export interface Episode {
  image: string;
  audio: string;
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

export interface Venue {
  id: number;
  name: string;
  city: string;
  country: string;
  region: string;
  state: string;
  streetAddress: string;
}

export type SearchField = 'episode' | 'title' | 'description' | 'words';

export type SearchFiltersState = Record<SearchField, boolean>;

export type EpisodeType = 'live' | 'compilation' | 'wfh' | 'office';

export type EpisodeTypeFiltersState = Record<EpisodeType, boolean>;

export type PresentersFilterState = number[];

export type SearchFilterLabels = Record<SearchField, string>;
export type EpisodeTypeFilterLabels = Record<EpisodeType, string>;

export type Option = {
  label: string;
  value: number;
};

export type SelectedOption<T> = {
  name: T;
  checked: boolean;
};

export type SelectEpisodeWords = (episode: number) => Promise<Word[]>;

export interface SearchEpisodeWordsResult {
  episode: number;
}

export type SearchEpisodeWords = (
  searchTerm: string,
  filters: SearchFiltersState
) => Promise<SearchEpisodeWordsResult[]>;

export type SearchResults = Record<number, boolean>;

// These match the image names for the icons (e.g. anna.png)
export type Host = 'dan' | 'james' | 'anna' | 'andy';

export interface EpisodeAudioCellProps {
  isOpen: boolean;
  episode: Episode;
}

export interface EpisodeSummaryCellProps {
  isOpen: boolean;
  onClick: () => void;
  episode: Episode;
}

export interface EpisodeRowProps {
  episode: Episode;
  expanded: boolean;
}

export interface PaginatorProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

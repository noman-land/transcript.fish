export interface Episode {
  image: string;
  description: string;
  duration: number;
  episode: number;
  title: string;
  pubDate: string;
}

export interface Word {
  startTime: number;
  endTime: number;
  word: string;
  probability: number;
}

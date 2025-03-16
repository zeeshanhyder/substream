enum ContentCategory {
  MOVIE,
  TV,
}

type ExternalID = {
  name: string;
  id: string;
};

type Rating = {
  name: string;
  rating: string;
  iconLink?: string;
};

type Season = {
  id: string;
  shortName: string;
  summary: string;
  episodes: [HFContent];
};

export type HFContent = {
  id: string;
  title: string;
  alternateTitles: string[];
  summary: string; // what happens in movie/episode
  category: ContentCategory;
  externalIds: ExternalID[];
  releaseDate: string;
  simpleId?: string; // S06E04
  index?: number; // which episode?
  rating?: Rating[];
  duration?: number;
  thumbnailImage?: string;
  backdropImage?: string;
  posterImage?: string;
  trailerLink?: string;
  seasons?: [Season];
  streamId: string;
  originalMediaSource: string;
};

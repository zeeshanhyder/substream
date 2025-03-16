export type GoogleSearchResult = {
  kind?: string;
  url?: URL;
  queries?: Queries;
  context?: Context;
  searchInformation?: SearchInformation;
  items?: Item[];
};

export type Context = {
  title?: string;
};

export type Item = {
  kind?: Kind;
  title?: string;
  htmlTitle?: string;
  link?: string;
  displayLink?: string;
  snippet?: string;
  htmlSnippet?: string;
  formattedUrl?: string;
  htmlFormattedUrl?: string;
  pagemap?: Pagemap;
};

export enum Kind {
  CustomsearchResult = 'customsearch#result',
}

export type Pagemap = {
  cse_thumbnail?: CSEThumbnail[];
  metatags?: { [key: string]: string }[];
  cse_image?: CSEImage[];
  videoobject?: Videoobject[];
};

export type CSEImage = {
  src?: string;
};

export type CSEThumbnail = {
  src?: string;
  width?: string;
  height?: string;
};

export type Videoobject = {
  duration?: string;
  contenturl?: string;
  uploaddate?: Date;
  name?: string;
  description?: string;
  thumbnailurl?: string;
};

export type Queries = {
  request?: NextPage[];
  nextPage?: NextPage[];
};

export type NextPage = {
  title?: string;
  totalResults?: string;
  searchTerms?: string;
  count?: number;
  startIndex?: number;
  inputEncoding?: string;
  outputEncoding?: string;
  safe?: string;
  cx?: string;
};

export type SearchInformation = {
  searchTime?: number;
  formattedSearchTime?: string;
  totalResults?: string;
  formattedTotalResults?: string;
};

export type URL = {
  type?: string;
  template?: string;
};

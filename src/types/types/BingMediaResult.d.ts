export type BingMediaResult = {
  _type?: string;
  instrumentation?: Instrumentation;
  queryContext?: QueryContext;
  webPages?: WebPages;
  rankingResponse?: RankingResponse;
};
type Instrumentation = {
  _type?: string;
  pingUrlBase?: string;
  pageLoadPingUrl?: string;
};
type QueryContext = {
  originalQuery?: string;
};
type RankingResponse = {
  mainline?: Mainline;
};
type Mainline = {
  items?: Item[];
};
type Item = {
  answerType?: AnswerType;
  resultIndex?: number;
  value?: ItemValue;
};
declare enum AnswerType {
  WebPages = 'WebPages',
}
type ItemValue = {
  id?: string;
};
type WebPages = {
  webSearchUrl?: string;
  webSearchUrlPingSuffix?: string;
  totalEstimatedMatches?: number;
  value?: ValueElement[];
};
type ValueElement = {
  id?: string;
  name?: string;
  url?: string;
  urlPingSuffix?: string;
  datePublished?: Date;
  datePublishedDisplayText?: string;
  isFamilyFriendly?: boolean;
  displayUrl?: string;
  snippet?: string;
  deepLinks?: DeepLink[];
  dateLastCrawled?: Date;
  openGraphImage?: OpenGraphImage;
  fixedPosition?: boolean;
  language?: Language;
  isNavigational?: boolean;
  richFacts?: RichFact[];
  richCaptionGoBigHints?: RichCaptionGoBigHints;
  noCache?: boolean;
  siteName?: SiteName;
  contractualRules?: ContractualRule[];
};
type ContractualRule = {
  _type?: string;
  targetPropertyName?: string;
  targetPropertyIndex?: number;
  mustBeCloseToContent?: boolean;
  license?: DeepLink;
  licenseNotice?: string;
};
type DeepLink = {
  name?: string;
  url?: string;
  urlPingSuffix?: string;
};
declare enum Language {
  En = 'en',
}
type OpenGraphImage = {
  contentUrl?: string;
  width?: number;
  height?: number;
};
type RichCaptionGoBigHints = {
  title?: string;
  publishDateDisplayText?: string;
};
type RichFact = {
  label?: Hint;
  items?: Hint[];
  hint?: Hint;
};
type Hint = {
  text?: string;
};
declare enum SiteName {
  IMDB = 'IMDb',
  TheTVDBCOM = 'TheTVDB.com',
  Wikipedia = 'Wikipedia',
}
export type BingSearchResultList = NonNullable<NonNullable<BingMediaResult['webPages']>['value']>;
export {};
//# sourceMappingURL=BingMediaResult.d.ts.map

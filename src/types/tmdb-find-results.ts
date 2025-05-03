export type Genre = Partial<{
  id: number;
  name: string;
}>;

export type Images = Partial<{
  backdrops: Backdrop[];
  logos: Logo[];
  posters: Poster[];
}>;

export type Backdrop = Partial<{
  aspect_ratio: number;
  height: number;
  iso_639_1?: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}>;

export interface Logo {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface Poster {
  aspect_ratio: number;
  height: number;
  iso_639_1?: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export type VideoResult = Partial<{
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}>;

export interface Videos {
  results: VideoResult[];
}

export type TmdbMovieShape = Partial<{
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: Videos;
  images: Images;
}>;

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string;
}

export interface LastEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

export interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCompany {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export type TmdbTVShowShape = Partial<{
  adult: boolean;
  backdrop_path: string;
  created_by: CreatedBy[];
  episode_run_time: any[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir;
  name: string;
  next_episode_to_air: any;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  videos: Videos;
  images: Images;
}>;

export type TmdbEpisodeShape = {
  id: number;
  name: string;
  overview: string;
  media_type: string;
  vote_average?: number;
  vote_count?: number;
  air_date?: string;
  episode_number?: number;
  episode_type?: string;
  production_code?: string;
  runtime?: number;
  season_number?: number;
  show_id?: number;
  still_path?: string;
};

interface TmdbMediaEntityShape {
  backdrop_path?: string;
  id?: number;
  overview?: string;
  poster_path?: string;
  media_type?: string;
  adult?: boolean;
  original_language?: string;
  genre_ids?: number[];
  popularity?: number;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

export type TmdbFindResult = {
  movie_results?: TmdbMovieShape[];
  person_results?: TmdbMediaEntityShape[];
  tv_results?: TmdbTVShowShape[];
  tv_episode_results?: TmdbEpisodeShape[];
  tv_season_results?: TmdbMediaEntityShape[];
};

export type TmdbTVShowWithSeasonResult = {
  tvShow: TmdbTVShowShape;
  episodes?: TmdbSeasonResult | null;
};

/**
 * Type guard to check if the media object is a movie.
 *
 * @param media - The media object to check
 * @returns {boolean} True if the media object is a movie, false otherwise
 */
export function isMovie(media: TmdbEpisodeShape | TmdbMovieShape | TmdbTVShowShape): media is TmdbMovieShape {
  return (media as TmdbMovieShape).title !== undefined;
}

/**
 * Type guard to check if the media object is a TV show.
 *
 * @param media - The media object to check
 * @returns {boolean} True if the media object is a TV show, false otherwise
 */
export function isTVShow(media: TmdbEpisodeShape | TmdbMovieShape | TmdbTVShowShape): media is TmdbTVShowShape {
  return (media as TmdbTVShowShape).name !== undefined && (media as TmdbEpisodeShape).show_id === undefined;
}

/**
 * Type guard to check if the media object is a TV episode.
 *
 * @param media - The media object to check
 * @returns {boolean} True if the media object is a TV episode, false otherwise
 */
export function isEpisode(media: TmdbEpisodeShape | TmdbMovieShape | TmdbTVShowShape): media is TmdbEpisodeShape {
  return (media as TmdbEpisodeShape).episode_number !== undefined;
}

/**
 * Type guard to check if the media object is a TV show with season details.
 *
 * @param media - The media object to check
 * @returns {boolean} True if the media object is a TV show with season details, false otherwise
 */
export function isShowWithSeasonDetails(media: TmdbTVShowWithSeasonResult): media is TmdbTVShowWithSeasonResult {
  return (
    (media as TmdbTVShowWithSeasonResult).episodes !== undefined ||
    (media as TmdbTVShowWithSeasonResult).tvShow !== undefined
  );
}

type Crew = {
  job?: Job;
  department?: Department;
  credit_id?: string;
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for_department?: Department;
  name?: string;
  original_name?: string;
  popularity?: number;
  profile_path?: null | string;
  character?: string;
  order?: number;
};

enum Department {
  Acting = 'Acting',
  Directing = 'Directing',
  Production = 'Production',
  Sound = 'Sound',
  VisualEffects = 'Visual Effects',
  Writing = 'Writing',
}

enum Job {
  AssociateProducer = 'Associate Producer',
  CoProducer = 'Co-Producer',
  Director = 'Director',
  LineProducer = 'Line Producer',
  OriginalMusicComposer = 'Original Music Composer',
  Writer = 'Writer',
}

enum EpisodeType {
  Finale = 'finale',
  Standard = 'standard',
}

export type TmdbSeasonResult = {
  _id?: string;
  air_date?: Date;
  episodes?: TmdbEpisodeShape[];
  name?: string;
  overview?: string;
  id?: number;
  poster_path?: string;
  season_number?: number;
  vote_average?: number;
};

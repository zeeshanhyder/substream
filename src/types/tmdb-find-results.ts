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

interface ITmdbMovie {
  title?: string;
  original_title?: string;
  release_date?: string;
}

export type TmdbMovieShape = TmdbMediaEntityShape & ITmdbMovie;

interface ITmdbTV {
  name?: string;
  original_name?: string;
  first_air_date?: string;
}
export type TmdbTVShowShape = TmdbMediaEntityShape & ITmdbTV;

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

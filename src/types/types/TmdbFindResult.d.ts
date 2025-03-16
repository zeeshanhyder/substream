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
export declare function isMovie(media: TmdbEpisodeShape | TmdbMovieShape | TmdbTVShowShape): media is TmdbMovieShape;
/**
 * Type guard to check if the media object is a TV show.
 *
 * @param media - The media object to check
 * @returns {boolean} True if the media object is a TV show, false otherwise
 */
export declare function isTVShow(media: TmdbEpisodeShape | TmdbMovieShape | TmdbTVShowShape): media is TmdbTVShowShape;
/**
 * Type guard to check if the media object is a TV episode.
 *
 * @param media - The media object to check
 * @returns {boolean} True if the media object is a TV episode, false otherwise
 */
export declare function isEpisode(
  media: TmdbEpisodeShape | TmdbMovieShape | TmdbTVShowShape,
): media is TmdbEpisodeShape;
/**
 * Type guard to check if the media object is a TV show with season details.
 *
 * @param media - The media object to check
 * @returns {boolean} True if the media object is a TV show with season details, false otherwise
 */
export declare function isShowWithSeasonDetails(media: TmdbTVShowWithSeasonResult): media is TmdbTVShowWithSeasonResult;
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
export {};
//# sourceMappingURL=TmdbFindResult.d.ts.map

import { IMediaEntity } from "../../models/media-entity";
import { IntermediateMetadata } from "../../types/media-metadata";
import { TmdbMovieShape, TmdbTVShowShape, TmdbSeasonResult } from "../../types/tmdb-find-results";
import { databaseInstance } from "../mongoose-client";
import { insertEpisodesMetadata } from "./insert-episode-metadata-activity";
import { insertMediaMetadata } from "./insert-media-metadata-activity";

/**
 * Saves media metadata information to the MongoDB document
 * @param mediaId - Unique identifier for the media
 * @param userId - Unique identifier for the user to whom the media entry belongs
 * @param imdbId - The IMDB ID of the media
 * @param tmdbResult - The TMDB result containing movie or TV show data
 * @returns Promise<IMediaEntity> - The saved media entity
 */
export async function insertMetadata(
    mediaId: string,
    userId: string,
    imdbId: string,
    tmdbResult?: TmdbMovieShape | TmdbTVShowShape | null,
    tmdbSeasonResult?: TmdbSeasonResult | null,
    basicMetadata?: IntermediateMetadata,
  ): Promise<IMediaEntity | null> {
    if (!tmdbResult) {
      return null;
    }
    const db = databaseInstance.getDb();
    if (!db) {
      console.error('No MongoDB instance available');
      return null;
    }
    let mediaEntry;
  
    if (tmdbSeasonResult && basicMetadata?.season && basicMetadata.episode) {
      console.log('INFO: Detected season and episode metadata. Treating media as TV show');
      mediaEntry = await insertEpisodesMetadata(mediaId, userId, basicMetadata, imdbId, tmdbResult, tmdbSeasonResult);
    } else {
      console.log('INFO: Treating media as single entry');
      mediaEntry = await insertMediaMetadata(mediaId, userId, imdbId, tmdbResult);
    }
    return mediaEntry || null;
  }
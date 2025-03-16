import { MediaEntityModel, IMediaEntity } from "../../models/media-entity";
import { TmdbMovieShape, TmdbTVShowShape, isMovie, isTVShow } from "../../types/tmdb-find-results";
import { databaseInstance } from "../mongoose-client";

/**
 * Inserts or updates metadata for a movie or TV show in the database
 * 
 * @param mediaId - Unique identifier for the media entry
 * @param userId - Unique identifier of the user who owns the media
 * @param imdbId - The IMDB identifier for the media
 * @param tmdbResult - The TMDB result containing movie or TV show data
 * @returns Promise resolving to the updated media entity or null if operation fails
 */
export async function insertMediaMetadata(mediaId: string, userId: string, imdbId: string, tmdbResult: TmdbMovieShape | TmdbTVShowShape) {
    const db = databaseInstance.getDb();
    if (!db) {
      console.error('No MongoDB instance available');
      return null;
    }
  
    let mediaTitle: string = '';
    let alternateTitle: string = '';
    let releaseDate: string = '';
  
    if (isMovie(tmdbResult)) {
      mediaTitle = tmdbResult.title ?? '';
      alternateTitle = tmdbResult.original_title ?? '';
      releaseDate = tmdbResult.release_date ?? '';
    }
  
    if (isTVShow(tmdbResult)) {
      mediaTitle = tmdbResult.name ?? '';
      alternateTitle = tmdbResult.original_name ?? '';
      releaseDate = tmdbResult.first_air_date ?? '';
    }
  
    const metadataObject = {
      metadata: {
        releaseDate,
        alternateTitle,
        id: mediaId,
        title: mediaTitle,
        summary: tmdbResult.overview,
        category: isTVShow(tmdbResult) ? 'TV' : 'MOVIE',
        imdbId: imdbId ?? '',
        tmdbId: tmdbResult.id,
        simpleId: '',
        index: 0,
        rating: [{ name: 'TMDB', rating: tmdbResult.vote_average }],
        duration: 0,
        thumbnailImage: tmdbResult.poster_path,
        titleImage: '',
        backdropImage: tmdbResult.backdrop_path,
        posterImage: tmdbResult.poster_path,
        trailerLink: '',
      },
    };
    console.log(`INFO: Inserting ${tmdbResult?.media_type ?? ''} metadata into DB`);
    const updatedMediaEntry = await MediaEntityModel.findOneAndUpdate({ id: mediaId, userId }, metadataObject, {
      new: true,
    });
    return updatedMediaEntry?.toJSON() as IMediaEntity;
  }
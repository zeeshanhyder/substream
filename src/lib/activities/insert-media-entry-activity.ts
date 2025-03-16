import { IMediaEntity, MediaEntityModel } from "../../models/media-entity";
import { databaseInstance } from "../mongoose-client";

/**
 * Creates a new media entry in the database with basic metadata
 * @param params - Object containing media entry parameters
 * @param params.id - Unique identifier for the media entry
 * @param params.mediaTitle - Title of the media
 * @param params.mediaLocation - File system path of the media
 * @param params.category - Media category (MOVIE/TV)
 * @param params.userId - ID of the user owning the media
 * @returns Promise resolving to the created media entity
 * @throws {ApplicationFailure} If database connection fails
 */
export async function insertMediaEntry(
    mediaEntry: Pick<IMediaEntity, 'id' | 'mediaTitle' | 'mediaLocation' | 'metadata' | 'category' | 'userId'>,
  ): Promise<IMediaEntity | null> {
    const db = databaseInstance.getDb();
    if (!db) {
      console.error('No MongoDB instance available');
      return null;
    }
    const mediaEntity = new MediaEntityModel(mediaEntry);
    const savedMediaEntry = await mediaEntity.save();
    console.log('INFO: Media entry created');
    return savedMediaEntry.toJSON() as IMediaEntity;
  }
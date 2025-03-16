import { MediaEntityModel } from '../../models/media-entity';
import { databaseInstance } from '../mongoose-client';

/**
 * Deletes a media entry from the database using its unique identifier
 * @param mediaEntryId - The UUID of the media entry to delete
 * @returns Promise<DeleteResult> - Returns MongoDB deletion result object
 * @throws Will return undefined and log error if database connection is unavailable
 */
export async function deleteMediaEntry(mediaEntryId: string) {
  const db = databaseInstance.getDb();
  if (!db) {
    console.error('No MongoDB instance available');
    return;
  }
  const res = await MediaEntityModel.deleteOne({ id: mediaEntryId });
  console.log('INFO: Deleted media entry with id: ' + mediaEntryId);
  return res;
}

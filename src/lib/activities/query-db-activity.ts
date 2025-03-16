import { databaseInstance } from '../mongoose-client';
import { IMediaEntity, MediaEntityModel } from '../../models/media-entity';
import { RootFilterQuery } from 'mongoose';

type RootFilterQueryWithPipeline<T> = RootFilterQuery<T> & {
  pipeline?: any[];
};

/**
 * Queries the database for media entries matching the provided filter
 * @param filter - MongoDB query filter object
 * @returns Promise resolving to the found media entity or null
 * @throws {ApplicationFailure} If database connection is unavailable
 */
export async function queryDB(query: RootFilterQueryWithPipeline<IMediaEntity>): Promise<IMediaEntity | null> {
  try {
    const db = databaseInstance.getDb();
    if (!db) {
      console.error('No MongoDB instance available');
      return null;
    }
    console.log('INFO: Querying DB');
    if (query.pipeline) {
      const result = await MediaEntityModel.aggregate(query.pipeline);
      const aggregateResult = result[0];
      if (aggregateResult) {
        console.log('INFO: Found metadata in DB via aggregate');
        return aggregateResult;
      }
    } else {
      const mediaEntry = await MediaEntityModel.findOne(query);
      if (mediaEntry) {
        console.log('INFO: Found metadata in DB');
        return mediaEntry;
      }
    }
    console.log('INFO: No results found in DB. ');
    return null;
  } catch (error) {
    console.error('Error fetching data from DB:', error);
    return null;
  }
}

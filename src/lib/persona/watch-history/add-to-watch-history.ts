import { IWatchHistoryEntry, UserWatchHistoryModel } from '../../../models/watch-history';
import { databaseInstance } from '../../mongoose-client';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';

/**
 * Adds a media entry to the user's watch history with timestamp
 * @param userId - User identifier
 * @param watchEntry - Watch history data without timestamp
 * @returns ServiceResponse with new history entry or error
 */
export default async function addToWatchHistory(
  userId: string,
  watchEntry: Omit<IWatchHistoryEntry, 'watchedAt'>,
): Promise<ServiceResponse<IWatchHistoryEntry | null>> {
  try {
    const db = databaseInstance.getDb();
    if (!db) {
      return {
        data: null,
        error: 'Database connection unavailable',
        status: HTTPStatus.SERVICE_UNAVAILABLE,
      };
    }

    const entry: IWatchHistoryEntry = {
      ...watchEntry,
      watchedAt: new Date(),
    };

    // Update or create watch history document
    const result = await UserWatchHistoryModel.findOneAndUpdate(
      { userId },
      {
        $push: {
          history: {
            $each: [entry],
            $position: 0, // Add to beginning of array
            $slice: 1000, // Limit history to 1000 entries
          },
        },
      },
      { upsert: true, new: true },
    );

    if (!result) {
      return {
        data: null,
        error: 'Failed to update watch history',
        status: HTTPStatus.INTERNAL_SERVER_ERROR,
      };
    }

    return {
      data: result.history[0],
      status: HTTPStatus.CREATED,
    };
  } catch (error) {
    console.error('[ERROR]: Error updating watch history:', error);
    return {
      data: null,
      error: 'Internal Server Error',
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
    };
  }
}

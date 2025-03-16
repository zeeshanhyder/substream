import { IWatchHistoryEntry, UserWatchHistoryModel } from '../../../models/watch-history';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';
import { databaseInstance } from '../../mongoose-client';

/**
 * Retrieves paginated watch history for a user
 * @param userId - User identifier
 * @param limit - Maximum entries to return (default: 20)
 * @param skip - Number of entries to skip (default: 0)
 * @returns ServiceResponse with history array or error
 */
export default async function getUserWatchHistory(
  userId: string,
  limit = 20,
  skip = 0,
): Promise<ServiceResponse<IWatchHistoryEntry[] | null>> {
  try {
    const db = databaseInstance.getDb();
    if (!db) {
      return {
        data: null,
        error: 'Database connection unavailable',
        status: HTTPStatus.SERVICE_UNAVAILABLE,
      };
    }

    const result = await UserWatchHistoryModel.findOne({ userId }, { history: { $slice: [skip, limit] } }).sort({
      'history.watchedAt': -1,
    });

    if (!result) {
      return {
        data: [],
        status: HTTPStatus.OK,
      };
    }

    return {
      data: result.history,
      status: HTTPStatus.OK,
    };
  } catch (error) {
    console.error('[ERROR]: Error fetching watch history:', error);
    return {
      data: null,
      error: 'Internal Server Error',
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
    };
  }
}

import { IWatchHistoryEntry, UserWatchHistoryModel } from '../../../models/watch-history';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';
import { databaseInstance } from '../../mongoose-client';

/**
 * Retrieves watch history for a specific media item
 * @param userId - User identifier
 * @param mediaId - Media item identifier
 * @returns ServiceResponse with most recent media watch entry or null
 */
export default async function getMediaWatchHistoryForUser(
  userId: string,
  mediaId: string,
): Promise<ServiceResponse<IWatchHistoryEntry | null>> {
  const db = databaseInstance.getDb();
  if (!db) {
    return {
      data: null,
      error: 'Database connection unavailable',
      status: HTTPStatus.SERVICE_UNAVAILABLE,
    };
  }

  try {
    const mediaWatchHistory = await UserWatchHistoryModel.findOne(
      { userId: userId, 'history.mediaId': mediaId },
      { 'history.$': 1 }, // Return only the matched history entry
    ).sort({ 'history.watchedAt': -1 });

    if (!mediaWatchHistory || !mediaWatchHistory.history.length) {
      return {
        data: null,
        status: HTTPStatus.OK,
      };
    }

    return {
      data: mediaWatchHistory.history[0],
      status: HTTPStatus.OK,
    };
  } catch (error) {
    return {
      data: null,
      error: `Failed to retrieve media watch history: ${error instanceof Error ? error.message : 'Unknown error'}`,
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
    };
  }
}

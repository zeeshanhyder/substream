import { Request, Response } from 'express';
import { z } from 'zod';
import { getUser } from '../../../lib/persona';
import { ServiceError } from '../../../lib/utils';
import { addToWatchHistory } from '../../../lib/persona';
import { IWatchHistoryEntry } from '../../../models/watch-history';
import { HTTPStatus } from '../../../types/service-response';

/**
 * Zod schema for validating user and media parameters
 */
const userSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  mediaId: z.string().min(1, 'Media ID is required'),
});

/**
 * Zod schema for validating watch history entry data
 */
const watchSchema = z.object({
  watchDuration: z.number().min(0, 'Duration cannot be less than zero'), // in seconds
  progress: z.number().min(0, 'Progress cannot be less than zero'), // percentage 0-100
});

/**
 * Express handler for updating a user's watch history for a specific media item
 * @param req - Express request with userId and mediaId in params, watch entry in body
 * @param res - Express response object
 * @returns ServiceResponse with updated watch history or error details
 */
const updateWatchHistory = async (
  req: Request<z.infer<typeof userSchema>, {}, { watchEntry: z.infer<typeof watchSchema> }>,
  res: Response,
) => {
  try {
    // Get user ID from request params or query
    const userId = req.params?.userId ?? '';
    const mediaId = req.params?.mediaId ?? '';

    const result = userSchema.safeParse({ userId, mediaId });
    const watchResult = watchSchema.safeParse(req.body.watchEntry);
    if (!result.success) {
      throw result.error;
    }

    if (!watchResult.success) {
      throw watchResult.error;
    }
    const watchEntry = req.body.watchEntry as IWatchHistoryEntry;
    const userResponse = await getUser({ userId: result.data.userId });

    if (userResponse.error) {
      throw new ServiceError(userResponse.error, userResponse.status);
    }

    const updatedWatchHistory = await addToWatchHistory(userId, { ...watchEntry, mediaId });
    res.status(HTTPStatus.UPDATED).json(updatedWatchHistory);
    return;
  } catch (error) {
    if (error instanceof ServiceError) {
      res.status(error.status).json({
        error: error.message,
      });
      return;
    }
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: error.issues,
      });
      return;
    }
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
    return;
  }
};

export default updateWatchHistory;

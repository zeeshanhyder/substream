import { Request, Response } from 'express';
import z, { ZodError } from 'zod';
import { HTTPStatus } from '../../../types/service-response';
import { ServiceError } from '../../../lib/utils';
import { getWatchHistory } from '../../../lib/persona';

/**
 * Zod schema for validating user watch history requests
 */
const userWatchHistorySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

/**
 * Express handler for retrieving a user's complete watch history
 * @param req - Express request with userId in params
 * @param res - Express response object
 * @returns ServiceResponse with user's watch history or error details
 */
export default async function fetchUserWatchHistory(
  req: Request<z.infer<typeof userWatchHistorySchema>, {}, {}>,
  res: Response,
) {
  try {
    const { userId } = req.params;
    const safeUserWatchHistoryInput = userWatchHistorySchema.safeParse({ userId });

    if (!safeUserWatchHistoryInput.success) {
      throw safeUserWatchHistoryInput.error;
    }
    const watchHistory = await getWatchHistory(safeUserWatchHistoryInput.data.userId);
    res.status(watchHistory.status).json(watchHistory);
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        data: null,
        error: error.issues,
        status: HTTPStatus.BAD_REQUEST,
      });
      return;
    }
    if (error instanceof ServiceError) {
      res.status(error.status).json({
        data: null,
        error: error.message,
        status: error.status,
      });
      return;
    }
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      data: null,
      error: 'Internal server error',
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

import { Request, Response } from 'express';
import z, { ZodError } from 'zod';
import { HTTPStatus } from '../../../types/service-response';
import { ServiceError } from '../../../lib/utils';
import { getMediaWatchHistoryForUser } from '../../../lib/persona';

const userWatchSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  mediaId: z.string().min(1, 'Media ID is required'),
});

export default async function fetchMediaWatchHistory(
  req: Request<z.infer<typeof userWatchSchema>, {}, {}>,
  res: Response,
) {
  try {
    const { userId, mediaId } = req.params;
    const validationResult = userWatchSchema.safeParse({ userId, mediaId });

    if (!validationResult.success) {
      throw validationResult.error;
    }
    const watchEntry = await getMediaWatchHistoryForUser(userId, mediaId);
    res.status(watchEntry.status).json(watchEntry);
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

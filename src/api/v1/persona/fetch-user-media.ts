import { Request, Response } from 'express';
import z, { ZodError } from 'zod';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';
import { ServiceError } from '../../../lib/utils';
import { getUserMedia } from '../../../lib/persona';
import { IMediaEntity } from '../../../models/media-entity';

/**
 * Zod schema for validating user media requests
 */
const userMediaSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  category: z.enum(['MOVIE', 'TV']).optional(),
});

/**
 * Express handler for retrieving a user's media library with optional category filtering
 * @param req - Express request with userId in params and optional category in query
 * @param res - Express response object
 * @returns ServiceResponse with user's media items or error details
 */
export default async function fetchUserMedia(
  req: Request<z.infer<typeof userMediaSchema>, {}, {}>,
  res: Response<ServiceResponse<IMediaEntity[] | null>>,
) {
  try {
    const { userId } = req.params;
    const { category } = req.query;
    const safeUserMediaInput = userMediaSchema.safeParse({ userId, category });

    if (!safeUserMediaInput.success) {
      throw safeUserMediaInput.error;
    }
    const watchEntry = await getUserMedia(safeUserMediaInput.data);
    res.status(watchEntry.status).json(watchEntry);
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        data: null,
        error: error.issues.toString(),
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

import { Request, Response } from 'express';
import { z } from 'zod';
import { getUser } from '../../../lib/persona';
import { ServiceError } from '../../../lib/utils';
import { IPersonaUser } from '../../../models/user-entity';
import { ServiceResponse, HTTPStatus } from '../../../types/service-response';

/**
 * Zod schema for validating watch session creation requests
 */
const userSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

/**
 * Express handler for creating a new watch session for a user
 * @param req - Express request with userId in params
 * @param res - Express response object
 * @returns ServiceResponse with user data or error details
 */
const createWatchSession = async (
  req: Request<z.infer<typeof userSchema>, {}, {}>,
  res: Response<ServiceResponse<IPersonaUser | null>>,
) => {
  try {
    // Get user ID from request params or query
    const userId = req.params?.userId ?? '';

    const result = userSchema.safeParse({ userId });
    if (!result.success) {
      throw result.error;
    }

    const userResponse = await getUser({ userId: result.data.userId });

    if (userResponse.error) {
      throw new ServiceError(userResponse.error, userResponse.status);
    }

    res.status(HTTPStatus.OK).json(userResponse);
    return;
  } catch (error) {
    if (error instanceof ServiceError) {
      res.status(error.status).json(error);
      return;
    }
    if (error instanceof z.ZodError) {
      res.status(HTTPStatus.BAD_REQUEST).json(new ServiceError(error.issues.toString(), HTTPStatus.BAD_REQUEST));
      return;
    }
    console.error('Error fetching user:', error);
    res
      .status(HTTPStatus.INTERNAL_SERVER_ERROR)
      .json(new ServiceError('Internal Server Error', HTTPStatus.INTERNAL_SERVER_ERROR));
    return;
  }
};

export default createWatchSession;

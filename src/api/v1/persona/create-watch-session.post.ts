import { Request, Response } from 'express';
import { z } from 'zod';
import { getUser } from '../../../lib/persona';
import { ServiceError } from '../../../lib/utils';

const userSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

const createWatchSession = async (req: Request<z.infer<typeof userSchema>, {}, {}>, res: Response) => {
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

    res.status(200).json(userResponse);
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

export default createWatchSession;

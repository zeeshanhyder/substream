import { Request, Response } from 'express';
import { z } from 'zod';
import { createUser } from '../../../lib/persona';
import { ServiceError } from '../../../lib/utils';
import { imageToBase64 } from '../../utils';

/**
 * Zod schema for user creation request validation
 */
const userSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  emailAddress: z.string().email('Invalid email format'),
  avatarUrl: z.string().url('Invalid avatar URL').default('https://avatar.iran.liara.run/public'),
  homeDirectory: z.string().min(1, 'Home directory is required'),
});

/**
 * Express handler for creating new Persona users
 * @param req - Express request with user data in body
 * @param res - Express response object
 * @returns ServiceResponse with created user or error details
 * @throws {ServiceError} For database issues or validation failures
 * @throws {ZodError} For invalid input format
 */
const createUserHandler = async (req: Request<{}, {}, z.infer<typeof userSchema>>, res: Response) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      throw result.error;
    }
    const base64Avatar = await imageToBase64(result.data.avatarUrl);
    const userEntry: z.infer<typeof userSchema> = {
      ...result.data,
      avatarUrl: base64Avatar,
    };

    const userResponse = await createUser(userEntry);

    if (userResponse.error) {
      throw new ServiceError(userResponse.error, userResponse.status);
    }

    res.status(userResponse.status).json(userResponse);
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

    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
    return;
  }
};

export default createUserHandler;

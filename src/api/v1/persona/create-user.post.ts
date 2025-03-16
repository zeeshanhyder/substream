import { Request, Response } from 'express';
import { z } from 'zod';
import { createUser } from '../../../lib/persona';
import { ServiceError } from '../../../lib/utils';
import { imageToBase64 } from '../../utils';

const userSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  emailAddress: z.string().email('Invalid email format'),
  avatarUrl: z.string().url('Invalid avatar URL').default('https://avatar.iran.liara.run/public'),
  homeDirectory: z.string().min(1, 'Home directory is required'),
});

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

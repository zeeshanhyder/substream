import { IPersonaUser, PersonaUser } from '../../../models/user-entity';
import { databaseInstance } from '../../mongoose-client';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';
import { ServiceError } from '../../utils';
import { z } from 'zod';

/**
 * Zod schema for validating user login credentials
 */
/**
 * Zod schema for user ID validation
 */
const loginSchema = z.object({
  userId: z.string().nanoid('Invalid user id format'),
});

/**
 * Retrieves a user profile by ID while excluding sensitive fields
 * @param credentials - Object containing the user's ID (valid nanoid string)
 * @returns Promise<ServiceResponse<IPersonaUser | null>> - Service response with user data or error details
 * @throws {ServiceError} - For database issues or user not found
 * @throws {z.ZodError} - For invalid input format
 */
const getUser = async (credentials: z.infer<typeof loginSchema>): Promise<ServiceResponse<IPersonaUser | null>> => {
  try {
    // Input validation
    const validatedInput = loginSchema.parse(credentials);

    // Database connection check
    const db = databaseInstance.getDb();
    if (!db) {
      throw new ServiceError('Database service unavailable', HTTPStatus.SERVICE_UNAVAILABLE);
    }

    // Find user by email
    const user = await PersonaUser.findOne({
      id: validatedInput.userId,
    }).select('-password -refreshToken'); // Exclude sensitive data

    if (!user) {
      throw new ServiceError('User not found', HTTPStatus.NOT_FOUND);
    }

    return {
      data: user.toJSON(),
      status: HTTPStatus.OK,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: 'Invalid input data',
        validationErrors: error.errors,
        status: HTTPStatus.BAD_REQUEST,
      };
    }

    if (error instanceof ServiceError) {
      return {
        data: null,
        error: error.message,
        status: error.status,
      };
    }

    console.error('[ERROR]: Unexpected error:', error);
    return {
      data: null,
      error: 'Internal Server Error',
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

export default getUser;

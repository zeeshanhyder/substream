import { nanoid } from 'nanoid';
import { IPersonaUser, PersonaUser } from '../../../models/user-entity';
import { databaseInstance } from '../../mongoose-client';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';
import { ServiceError } from '../../utils';
import { z } from 'zod';

const userSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  emailAddress: z.string().email('Invalid email format'),
  avatarUrl: z.string().base64('Invalid avatar URL'),
  homeDirectory: z.string().min(1, 'Home directory is required'),
});

/**
 * Creates a new user in the Persona system with validated input
 * @param user - User data object containing full name, email, avatar URL, and home directory
 * @returns Promise<ServiceResponse<IPersonaUser | null>> - Service response with created user or error details
 * @throws {ServiceError} - For database connection issues
 * @throws {z.ZodError} - For validation errors
 */
const createUser = async (user: z.infer<typeof userSchema>): Promise<ServiceResponse<IPersonaUser | null>> => {
  try {
    // Input validation
    const validatedInput = userSchema.parse(user);

    const db = databaseInstance.getDb();
    if (!db) {
      throw new ServiceError('Database service unavailable', HTTPStatus.SERVICE_UNAVAILABLE);
    }

    // Check if PersonaUser already exists
    const existingPersonaUser = await PersonaUser.findOne({
      emailAddress: validatedInput.emailAddress,
    });

    if (existingPersonaUser) {
      return {
        data: existingPersonaUser.toJSON(),
        status: HTTPStatus.OK,
      };
    }

    // Create new PersonaUser
    const newPersonaUser = new PersonaUser({
      id: nanoid(),
      ...validatedInput,
      mediaPathList: [],
    });

    // Save to MongoDB
    await newPersonaUser.save();

    return {
      data: newPersonaUser.toJSON(),
      status: HTTPStatus.CREATED,
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

    console.error('[ERROR]: Error creating user:', error);
    return {
      data: null,
      error: 'Internal Server Error',
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
    };
  }
};

export default createUser;

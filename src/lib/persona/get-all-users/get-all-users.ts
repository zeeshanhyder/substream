import { IPersonaUser, PersonaUser } from '../../../models/user-entity';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';
import { databaseInstance } from '../../mongoose-client';
import { ServiceError } from '../../utils';

/**
 * Retrieves all registered users from the database
 * @returns Promise<ServiceResponse<IPersonaUser[] | null>> - Service response containing:
 * - data: Array of user entities (empty array if no users found)
 * - error: Error message if applicable
 * - status: HTTP status code
 * @throws {ServiceError} - If database connection is unavailable (503 status)
 */
export default async function getAllUsers(): Promise<ServiceResponse<IPersonaUser[] | [] | null>> {
  try {
    const db = databaseInstance.getDb();
    if (!db) {
      throw new ServiceError('Database connection unavailable', HTTPStatus.SERVICE_UNAVAILABLE);
    }

    const result = await PersonaUser.find({});

    if (!result) {
      return {
        data: [],
        status: HTTPStatus.OK,
      };
    }
    return {
      data: result,
      status: HTTPStatus.OK,
    };
  } catch (err) {
    if (err instanceof ServiceError) {
      return {
        data: null,
        error: err.message,
        status: err.status,
      };
    }
    return {
      data: null,
      error: 'Internal Server Error',
      status: HTTPStatus.INTERNAL_SERVER_ERROR,
    };
  }
}

import getAllUsers from '../../../lib/persona/get-all-users/get-all-users';
import { Request, Response } from 'express';
import { ServiceError } from '../../../lib/utils';
import { IPersonaUser } from '../../../models/user-entity';
import { ServiceResponse, HTTPStatus } from '../../../types/service-response';

/**
 * Express handler for retrieving all registered users
 * @param _req - Express request (unused)
 * @param res - Express response object
 * @returns ServiceResponse with array of all users or error details
 */
const fetchAllUsers = async (_req: Request, res: Response<ServiceResponse<IPersonaUser[] | null>>) => {
  try {
    const users = await getAllUsers();
    res.status(HTTPStatus.OK).json(users);
  } catch (err) {
    if (err instanceof ServiceError) {
      res.status(err.status).json(err);
    } else {
      res
        .status(HTTPStatus.INTERNAL_SERVER_ERROR)
        .json(new ServiceError('Internal Server Error', HTTPStatus.INTERNAL_SERVER_ERROR));
    }
  }
};

export default fetchAllUsers;

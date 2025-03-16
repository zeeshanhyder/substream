import getAllUsers from '../../../lib/persona/get-all-users/get-all-users';
import { Request, Response } from 'express';
import { ServiceError } from '../../../lib/utils';

const fetchAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    if (err instanceof ServiceError) {
      res.status(err.status).json({
        error: err.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }
};

export default fetchAllUsers;

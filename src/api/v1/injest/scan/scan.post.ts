import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { HTTPStatus } from '../../../../types/service-response';
import { PersonaUser } from '../../../../models/user-entity';
import { ServiceError } from '../../../../lib/utils';
import { batchProcess, getMediaFileList } from '../utils';

/**
 * Zod schema for validating scan directory requests
 */
const schema = z.object({
  /** Unique identifier of the user initiating the scan */
  userId: z.string().min(1),
});

/**
 * Handles directory scanning and media processing initiation
 * @param req - Express request object containing user ID in body
 * @param res - Express response object for sending results
 * @returns JSON response with operation status and media file list
 * @throws {ServiceError} - For missing Temporal client or user not found
 * @throws {ZodError} - For invalid request body format
 *
 * @example
 * Successful response:
 * {
 *   status: 'MEDIA_PROCESS_STARTED',
 *   mediaFiles: ['/media/movie1.mp4', '/media/show1.mkv']
 * }
 */
export default async function scanDirectory(req: Request<{}, {}, z.infer<typeof schema>>, res: Response) {
  try {
    const { body } = req;
    const { temporalClient } = req.context;

    if (!temporalClient) {
      throw new ServiceError('No temporal client', HTTPStatus.SERVICE_UNAVAILABLE);
    }

    const result = schema.safeParse(body);
    if (!result.success) {
      throw new ZodError(result.error.issues);
    }

    const userId = result.data.userId;

    const userDetails = await PersonaUser.findOne({ id: userId });

    if (!userDetails) {
      throw new ServiceError('User not found', HTTPStatus.NOT_FOUND);
    }

    const homeDirectory = userDetails?.homeDirectory ?? '';

    const mediaFileList = await getMediaFileList(homeDirectory);
    batchProcess(mediaFileList, (filePath: string) => temporalClient.startWorkFlow(filePath, userId));

    console.log('INFO: Started media processing operation');

    res.json({
      status: 'MEDIA_PROCESS_STARTED',
      mediaFiles: mediaFileList,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      res.status(error.status).json({
        status: 'FAILED TO PROCESS MEDIA',
        error: error.message,
      });
      return;
    }
    if (error instanceof ZodError) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        status: 'FAILED TO PROCESS MEDIA',
        error: error.issues,
      });
      return;
    }
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      status: 'FAILED TO PROCESS MEDIA',
      error: 'Internal server error',
    });
  }
}

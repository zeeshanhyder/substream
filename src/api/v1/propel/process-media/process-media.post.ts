import { Request, Response } from 'express';
import { z } from 'zod';
import { ServiceError } from '../../../../lib/utils';
import { HTTPStatus } from '../../../../types/service-response';

/**
 * Zod schema for validating media processing requests
 */
const processMediaSchema = z.object({
  filePath: z.string().min(1, 'File path is required'),
});

/**
 * Express handler for initiating media processing workflows
 * @param req - Express request with file path in body
 * @param res - Express response object
 * @returns JSON response with workflow status and identifiers
 * @throws {ServiceError} When Temporal client is unavailable
 * @throws {z.ZodError} When request validation fails
 */
export default async function processMedia(req: Request<{}, {}, z.infer<typeof processMediaSchema>>, res: Response) {
  try {
    const { temporalClient } = req.context;
    if (!temporalClient) {
      throw new ServiceError('Downstream error', 503);
    }

    const result = processMediaSchema.safeParse(req.body);
    if (!result.success) {
      throw result.error;
    }

    const handle = await temporalClient.startWorkFlow(result.data.filePath);
    console.log('INFO: Started workflow', {
      workflowId: handle.workflowId,
      runId: handle.firstExecutionRunId,
    });

    res.json({
      status: 'STARTED',
      workflowId: handle.workflowId,
      runId: handle.firstExecutionRunId,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      res.status(error.status).json({
        status: 'FAILED',
        error: error.message,
      });
      return;
    }

    if (error instanceof z.ZodError) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        status: 'FAILED',
        error: error.issues,
      });
      return;
    }

    console.error('Error processing media:', error);
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      status: 'FAILED',
      error: 'Internal server error',
    });
    return;
  }
}

import { Request, Response } from 'express';
import { z } from 'zod';
import { ServiceError } from '../../../../lib/utils';
import { HTTPStatus } from '../../../../types/service-response';

/**
 * Zod schema for validating workflow status requests
 */
const workflowStatusSchema = z.object({
  workflowId: z.string().min(1, 'Workflow ID is required'),
});

/**
 * Type alias for workflow parameters
 */
type WorkflowParams = z.infer<typeof workflowStatusSchema>;

/**
 * Express handler for retrieving Temporal workflow execution status
 * @param req - Express request with workflowId in route parameters
 * @param res - Express response object
 * @returns JSON response with workflow status details and result data if completed
 * @throws {ServiceError} When Temporal client is unavailable
 * @throws {z.ZodError} When request validation fails
 */
export default async function getWorkflowStatus(req: Request<WorkflowParams>, res: Response) {
  try {
    const { temporalClient } = req.context;
    if (!temporalClient) {
      throw new ServiceError('Downstream error', HTTPStatus.SERVICE_UNAVAILABLE);
    }

    const zodValidationResult = workflowStatusSchema.safeParse(req.params);
    if (!zodValidationResult.success) {
      throw zodValidationResult.error;
    }

    const handle = await temporalClient.getProcessMediaClient().workflow.getHandle(zodValidationResult.data.workflowId);
    const workflow = await handle.describe();

    if (workflow.status.name === 'COMPLETED') {
      const data = await handle.result();
      res.json({
        status: workflow.status.name,
        workflowId: zodValidationResult.data.workflowId,
        runId: workflow.runId,
        taskQueue: workflow.taskQueue,
        pendingTasks: workflow.raw.pendingActivities ?? [],
        data,
      });
      return;
    }

    res.json({
      status: workflow.status.name,
      workflowId: zodValidationResult.data.workflowId,
      runId: workflow.runId,
      taskQueue: workflow.taskQueue,
      pendingTasks: workflow.raw.pendingActivities ?? [],
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

    console.error('Error fetching workflow status:', error);
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      status: 'FAILED',
      error: 'Workflow not found or error fetching status',
    });
    return;
  }
}

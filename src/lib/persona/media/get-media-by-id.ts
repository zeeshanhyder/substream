import { ServiceError } from '@temporalio/client';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';
import { z, ZodError } from 'zod';
import { databaseInstance } from '../../mongoose-client';
import { IMediaEntity, MediaEntityModel } from '../../../models/media-entity';
import { mongoMediaSearchPipelineByUserId } from '../../utils';

const getUserMediaSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  mediaId: z.string().min(1, 'Media ID is required'),
});

type UserMediaResult = Partial<{
  parent?: IMediaEntity;
  result?: IMediaEntity;
}>;

/**
 * Retrieves a specific media entry for a user using MongoDB aggregation
 * @param userMediaSchema - Object containing user ID and media ID
 * @returns Promise<ServiceResponse<IMediaEntity | null>> - Service response with media entity or error
 * @throws {ServiceError} - For database issues or unexpected errors
 */
export default async function getUserMediaById(
  userMediaSchema: z.infer<typeof getUserMediaSchema>,
): Promise<ServiceResponse<IMediaEntity | null | {}>> {
  try {
    const db = databaseInstance.getDb();
    if (!db) {
      return {
        data: null,
        error: 'Database connection unavailable',
        status: HTTPStatus.SERVICE_UNAVAILABLE,
      };
    }
    const safeGetUserMediaSchema = getUserMediaSchema.safeParse(userMediaSchema);
    if (!safeGetUserMediaSchema.success) {
      throw new ZodError(safeGetUserMediaSchema.error.issues);
    }
    const safeUserId = safeGetUserMediaSchema.data.userId;
    const safeMediaId = safeGetUserMediaSchema.data.mediaId;

    const pipeline = mongoMediaSearchPipelineByUserId(safeUserId, safeMediaId);
    const mediaResult = await MediaEntityModel.aggregate<UserMediaResult>(pipeline);
    let media: IMediaEntity | null = null;
    if (mediaResult.length > 0) {
      media = mediaResult[0]?.result ?? null;
      if (media !== null) {
        media.parent = mediaResult[0]?.parent;
      }
    }
    return {
      data: media,
      status: HTTPStatus.OK,
    };
  } catch (err) {
    throw new ServiceError(err instanceof Error ? err.message : 'Unknown error');
  }
}

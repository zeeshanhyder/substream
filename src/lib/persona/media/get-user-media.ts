import { ServiceError } from '@temporalio/client';
import { HTTPStatus, ServiceResponse } from '../../../types/service-response';
import { z, ZodError } from 'zod';
import { databaseInstance } from '../../mongoose-client';
import { IMediaEntity, MediaEntityModel } from '../../../models/media-entity';
import { skip } from 'node:test';

const getUserMediaSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  category: z.enum(['MOVIE', 'TV']).optional(),
  skip: z.number().optional(),
  limit: z.number().optional(),
});

export default async function getUserMedia(
  userMediaSchema: z.infer<typeof getUserMediaSchema>,
): Promise<ServiceResponse<IMediaEntity[] | null>> {
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
    const safeMediaCategory = safeGetUserMediaSchema.data.category;
    const safeSkip = safeGetUserMediaSchema.data.skip;
    const safeLimit = safeGetUserMediaSchema.data.limit;

    const queryInput: z.infer<typeof getUserMediaSchema> = {
      userId: safeUserId,
    };
    if (safeMediaCategory) {
      queryInput.category = safeMediaCategory;
    }
    const media = await MediaEntityModel.find(queryInput)
      .sort({
        createdAt: -1,
      })
      .skip(safeSkip ?? 0)
      .limit(safeLimit ?? 0);

    return {
      data: media,
      status: HTTPStatus.OK,
    };
  } catch (err) {
    throw new ServiceError(err instanceof Error ? err.message : 'Unknown error');
  }
}

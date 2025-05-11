import { Request, Response } from 'express';
import fs from 'fs';
import { ServiceError } from '../../../../lib/utils';
import { HTTPStatus } from '../../../../types/service-response';
import { getUserMediaById } from '../../../../lib/persona';
import { z, ZodError } from 'zod';
import { IMediaEntity } from '../../../../models/media-entity';

/**
 * Zod schema for validating media streaming requests
 */
const mediaFetchSchema = z.object({
  userId: z.string().nanoid().min(1, 'User ID is required'),
  mediaId: z.string().nanoid().min(1, 'Media ID is required'),
});

/**
 * Express handler for streaming media content with byte range support
 * @param req - Express request with userId and mediaId in params, range in headers
 * @param res - Express response object for streaming video content
 * @returns Video stream with appropriate headers for range requests
 * @throws {ServiceError} When media not found or access denied
 * @throws {ZodError} When request validation fails
 */
export default async function streamMedia(req: Request<z.infer<typeof mediaFetchSchema>, {}, {}>, res: Response) {
  try {
    const { userId, mediaId } = req.params;
    const range = req.headers.range ?? 'bytes 0-';

    const safeParseInput = mediaFetchSchema.safeParse({ userId, mediaId });

    if (!safeParseInput.success) {
      throw safeParseInput.error;
    }

    const mediaResult = await getUserMediaById(safeParseInput.data);
    const media = mediaResult.data as IMediaEntity | null;

    if (!media || !media.mediaLocation) {
      throw new ServiceError('Media not found', HTTPStatus.NOT_FOUND);
    }

    const videoPath = media.mediaLocation;
    const videoSize = fs.statSync(videoPath).size;
    const CHUNK_SIZE = 9 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        data: null,
        error: error.issues,
        status: HTTPStatus.BAD_REQUEST,
      });
      return;
    }

    if (error instanceof ServiceError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Error streaming media:', error);
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
    });
  }
}

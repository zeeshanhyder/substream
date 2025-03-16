import type { IntermediateMetadata, MediaMetadata } from '../../types/media-metadata';
import { extractBasicMetadata } from '../../util/media-content-data-mapper';
import { executeCommand } from '../../util/execute-command';

/**
 * Extracts metadata from a media file using ffprobe
 * @param mediaPath - The path to the media file
 * @returns Promise<IntermediateMetadata> - Basic metadata including filename, title and category
 */
export async function extractFileMetadata(mediaPath: string): Promise<IntermediateMetadata> {
  let filePath = '';
  try {
    filePath = mediaPath;
    console.log('INFO: Extracting metadata from file:', filePath);
    const metadataExtractCommand = `ffprobe -v quiet -print_format json -show_format -show_streams -hide_banner "${filePath}"`;
    const res = await executeCommand(metadataExtractCommand);
    const jsonResponse = JSON.parse(res) as MediaMetadata;
    const basicMetadata = extractBasicMetadata(jsonResponse, filePath);
    console.log('INFO: Extracted metadata:', basicMetadata);
    return basicMetadata;
  } catch (err) {
    console.error(err);
    return {
      fileName: filePath,
      title: '',
      category: 'MOVIE',
    };
  }
}
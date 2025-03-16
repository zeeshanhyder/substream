import { WorkflowHandleWithFirstExecutionRunId } from '@temporalio/client';
import fs from 'fs/promises';

/**
 * Get a list of all files in a directory
 * @param dir The directory to get the files from
 * @returns A list of all files in the directory
 */
export const getMediaFileList = async (dir: string) => {
  console.log(`INFO: Getting media file list from ${dir}`);
  const files = await fs.readdir(dir, { recursive: true, withFileTypes: true });
  const fileList: string[] = [];
  for await (const file of files) {
    if (file.name.endsWith('.mp4') || file.name.endsWith('.mkv')) {
      const fullPath = `${file.parentPath}/${file.name}`.replace(/\/+/g, '/');
      fileList.push(fullPath);
    }
  }
  return fileList;
};

/**
 * Process a list of files in batches
 * @param fileList Array of file paths to process
 * @param callback Async function to execute on each file
 * @param batchSize Number of files to process concurrently (default: 3)
 *
 * This method takes a list of files and processes them in parallel batches.
 * For example, with a batchSize of 3, it will process 3 files simultaneously,
 * wait for them to complete, then move on to the next 3 files.
 * This helps control system resources while maintaining parallel processing.
 */
export async function batchProcess(
  fileList: string[],
  callback: (file: string) => Promise<WorkflowHandleWithFirstExecutionRunId>,
  batchSize: number = 1,
) {
  console.log(`INFO: Batch size: ${batchSize}`);
  console.log(`INFO: Input media files:`, fileList);
  try {
    for (let i = 0; i < fileList.length; i += batchSize) {
      const batch = fileList.slice(i, i + batchSize).map((file) => callback(file));
      try {
        const workflows = await Promise.all(batch);
        await Promise.all(workflows.map((workflow) => workflow.result()));
        console.log(`INFO: Processed ${i + 1} / ${fileList.length} media files. Waiting one second`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('ERROR: Failed to process media files', error);
        throw error; // Re-throw to be caught by outer try-catch
      }
    }
  } catch (error) {
    console.error('ERROR: Batch processing failed, stopping execution', error);
    throw error; // Re-throw to notify caller
  }
}

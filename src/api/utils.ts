import { Router } from 'express';

/**
 * Converts an image URL to a base64 string.
 * @param url The URL of the image.
 * @returns A promise that resolves to the base64 string.
 */
export async function imageToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to convert image to base64: ${error.message}`);
    } else {
      throw new Error('Failed to convert image to base64');
    }
  }
}

/**
 * Logs the mounted routes of an Express router to the console.
 * @param router - The Express Router instance to inspect
 * @param component - The name of the component being mounted
 */
export function logMounts(router: Router, component: string) {
  router.stack.map((r) => console.log(`[${component}] Mounted ${r?.route?.path}`));
  console.info(`[${component}] Mount complete!\n`);
}

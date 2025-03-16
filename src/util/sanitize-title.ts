/**
 * Sanitizes a title string by removing special characters and formatting.
 *
 * @param title - The title string to sanitize
 * @returns {string} The sanitized title string
 */
export function sanitizeTitle(title: string): string {
  const sanitizedTitle = title
    .replace(/\./g, ' ') // Replace dots with spaces
    .replace(
      /x264|BluRay|Blu Ray|x265|mp4|mkv|mov|avi|DEFLATE|720p|1080p|HDR|4k|10-bit|5 1|DTS|\d{0,5}\s+kbps|HD|Kira\s+SEV|\w*[R|r]ip\b/gim,
      '',
    ) // Remove media encoding and rip info
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove all special characters
    .trim(); // Remove leading and trailing spaces

  return sanitizedTitle
    .split(' ')
    .filter((char) => !!char.length)
    .join(' ');
}

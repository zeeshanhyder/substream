import { IntermediateMetadata, MediaMetadata } from '../types/media-metadata';
import { sanitizeTitle } from './sanitize-title';

/**
 * Structure representing parsed episode information
 */
type EpisodeInfo = {
  fullMatch: string;
  season: string | null;
  episode: string | null;
};

/**
 * Extracts season and episode information from a media title
 * @param title - Media title to parse for episode information
 * @returns Object containing episode metadata (season, episode numbers, and full match)
 */
export const extractEpisodeMetadata = (title: string): EpisodeInfo => {
  // Common episode format patterns
  const episodeFormats = {
    standard: /[Ss](\d{1,3})\.?\s?[Ee][Pp]?(\d{1,3})/,
    verbose: /season\s?\.?(\d{1,3})\s?\.?(?:ep\.?|episode)?.*?\s?\.?(\d{1,3})/i,
    numerical: /(\d{1,2})x(\d{2})/, // Handles formats like "1x01"
  };

  let matchedEpisode: string | null = null;

  // Try each format and return the first match
  let seasonNumber: string | null = null;
  let episodeNumber: string | null = null;

  for (const [_, pattern] of Object.entries(episodeFormats)) {
    const match = title.match(pattern);
    if (match) {
      matchedEpisode = match[0];
      seasonNumber = match[1];
      episodeNumber = match[2];
      break; // Exit loop once we find a match
    }
  }

  return {
    fullMatch: matchedEpisode ?? '',
    season: seasonNumber,
    episode: episodeNumber,
  };
};

/**
 * Processes raw media metadata into a standardized intermediate format
 * @param inputMetadata - Raw metadata from media file
 * @param filePath - Path to the media file
 * @returns Structured metadata with title, episode info, and media type
 */
export const extractBasicMetadata = (inputMetadata: MediaMetadata, filePath: string): IntermediateMetadata => {
  const videoStream = inputMetadata?.streams?.filter((stream) => stream?.codec_type === 'video')?.[0];
  const formatDetails = inputMetadata?.format;
  const fileName = filePath.split('/').pop() ?? '';
  const videoFormat = filePath.split('.').pop(); // e.g: example.mp4 -> ['example', 'mp4']
  let title: string = '';

  if (videoStream) {
    title = videoStream?.tags?.title ?? '';
  }

  if (formatDetails) {
    title = formatDetails?.tags?.title ?? '';
  }

  let resolvedTitle = sanitizeTitle(title || fileName);
  const episodeInfo = extractEpisodeMetadata(resolvedTitle);
  const episode =
    episodeInfo?.episode && episodeInfo?.season
      ? `S${episodeInfo?.season} E${episodeInfo?.episode}`
      : episodeInfo?.fullMatch;

  if (episode) {
    // episode info is a great key to search
    // if we have SXXEXX format, we need just fewer title words. Searching with Title + SXXEXX produces much better results.
    resolvedTitle = resolvedTitle.split(' ').slice(0, 2).join(' ');
  }

  return {
    episodeFullMatch: episodeInfo?.fullMatch.replace(/[^\w]/g, ''),
    season: episodeInfo?.season ?? '',
    episode: episodeInfo?.episode ?? '',
    fileName: fileName ?? filePath,
    videoFormat,
    title: resolvedTitle,
    category: episodeInfo?.fullMatch ? 'TV' : 'MOVIE',
  };
};

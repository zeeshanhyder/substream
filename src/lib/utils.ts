import { HTTPStatus } from '../types/service-response';
import { PipelineStage } from 'mongoose';

/**
 * Custom error class for service-related errors with HTTP status codes
 * @extends Error
 */
export class ServiceError extends Error {
  /**
   * Creates a new ServiceError instance
   * @param message - Error message
   * @param status - HTTP status code
   */
  constructor(
    message: string,
    public status: HTTPStatus,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

/**
 * Creates a MongoDB aggregation pipeline to search for media by file path and user ID
 * This pipeline searches across both TV shows (in nested seasons/episodes) and movies
 * Returns documents that match both the file path and user ID, maintaining parent/child relationships
 * @param filePath - The file system path of the media file
 * @param userId - The ID of the user who owns the media
 * @returns Array of pipeline stages for MongoDB aggregation
 */
export const mongoMediaSearchPipeline = (filePath: string, userId: string) => [
  {
    $match: {
      $or: [
        { 'seasons.episodes.mediaLocation': filePath, userId },
        { mediaLocation: filePath, userId },
      ],
    },
  },
  {
    $facet: {
      tvShows: [
        { $unwind: '$seasons' },
        { $unwind: '$seasons.episodes' },
        { $match: { 'seasons.episodes.mediaLocation': filePath } },
        {
          $project: {
            result: '$seasons.episodes',
            parent: '$$ROOT',
          },
        },
      ],
      movies: [
        { $match: { mediaLocation: filePath, category: 'MOVIE' } },
        {
          $project: {
            result: '$$ROOT',
            parent: null,
          },
        },
      ],
    },
  },
  {
    $project: {
      result: {
        $concatArrays: ['$tvShows', '$movies'],
      },
    },
  },
  { $unwind: '$result' },
  { $replaceRoot: { newRoot: '$result' } },
];

/**
 * Creates facet stages for MongoDB aggregation pipeline to separate TV shows and movies
 * @param userId - The ID of the user who owns the media
 * @returns Object containing facet stages for TV shows and movies
 * @private
 */
const getFacet = (userId: string) => {
  const facets = {
    tvShows: [
      { $unwind: '$seasons' },
      { $unwind: '$seasons.episodes' },
      { $match: { 'seasons.episodes.userId': userId } },
      {
        $project: {
          result: '$seasons.episodes',
          parent: {
            $mergeObjects: [
              '$$ROOT',
              { seasons: undefined }, // Remove unwound seasons array
            ],
          },
        },
      },
    ],
    movies: [
      { $match: { userId, category: 'MOVIE' } },
      {
        $project: {
          result: '$$ROOT',
          parent: null,
        },
      },
    ],
  };

  return facets;
};

/**
 * Creates a MongoDB aggregation pipeline to search for media by user ID and media ID
 * This pipeline searches across both TV shows (in nested seasons/episodes) and movies
 * Returns a single document that matches both IDs, with proper parent/child relationships maintained
 * @param userId - The ID of the user who owns the media
 * @param mediaId - The unique identifier of the media item
 * @returns Array of pipeline stages for MongoDB aggregation
 */
export const mongoMediaSearchPipelineByUserId = (userId: string, mediaId: string): PipelineStage[] => [
  {
    $match: {
      $or: [
        { 'seasons.episodes.userId': userId, 'seasons.episodes.id': mediaId },
        { userId: userId, id: mediaId },
      ],
    },
  },
  {
    $facet: getFacet(userId),
  },
  {
    $project: {
      result: {
        $concatArrays: ['$tvShows', '$movies'],
      },
    },
  },
  { $unwind: '$result' },
  { $replaceRoot: { newRoot: '$result' } },
  {
    $limit: 1, // Lsimit to 1 document
  },
];

import { IntermediateMetadata, MediaMetadata } from '../types/media-metadata';
type EpisodeInfo = {
  fullMatch: string;
  season: string | null;
  episode: string | null;
};
export declare const extractEpisodeMetadata: (title: string) => EpisodeInfo;
export declare const extractBasicMetadata: (inputMetadata: MediaMetadata, filePath: string) => IntermediateMetadata;
export {};
//# sourceMappingURL=media-content-data-mapper.d.ts.map

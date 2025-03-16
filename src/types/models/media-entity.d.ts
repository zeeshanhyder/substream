import mongoose from 'mongoose';
export interface IMetadata {
  title: string;
  alternateTitle?: string;
  summary?: string;
  imdbId: string;
  tmdbId: string;
  releaseDate?: string;
  rating?: Array<{
    name: string;
    rating: string;
    iconLink?: string;
  }>;
  duration?: number;
  thumbnailImage?: string;
  titleImage?: string;
  backdropImage?: string;
  posterImage?: string;
  trailerLink?: string;
  language?: string;
}
export interface IMediaEntity extends mongoose.Document {
  id: string;
  mediaTitle: string;
  mediaLocation?: string;
  streamId?: string;
  seasons?: Array<{
    id: string;
    name: string;
    shortName: string;
    summary: string;
    seasonNumber: number;
    episodes: Array<IMediaEntity>;
  }>;
  simpleId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  category: 'MOVIE' | 'TV';
  metadata?: IMetadata;
}
declare const MediaEntityModel: mongoose.Model<
  IMediaEntity,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, IMediaEntity> &
    IMediaEntity &
    Required<{
      _id: unknown;
    }> & {
      __v: number;
    },
  any
>;
export { MediaEntityModel };
//# sourceMappingURL=media-entity.d.ts.map

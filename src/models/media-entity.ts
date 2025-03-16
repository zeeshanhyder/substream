import mongoose, { Schema, model } from 'mongoose';

const RatingSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: String, required: true },
  iconLink: { type: String },
});

const SeasonSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
  summary: { type: String, required: true },
  seasonNumber: { type: Number },
  episodes: { type: Array, ref: 'MediaEntity' },
});

const MediaEntitySchema = new Schema({
  id: { type: String, required: true },
  mediaTitle: { type: String, required: true },
  mediaLocation: { type: String },
  streamId: { type: String },
  seasons: { type: [SeasonSchema] },
  simpleId: { type: String },
  episodeNumber: { type: Number },
  seasonNumber: { type: Number },
  category: { type: String, enum: ['MOVIE', 'TV'], required: true },
  userId: { type: String, required: true },
  metadata: new Schema(
    {
      title: { type: String, required: true },
      alternateTitle: { type: String },
      summary: { type: String },
      imdbId: { type: String, required: true },
      tmdbId: { type: String, required: true },
      releaseDate: { type: String },
      rating: { type: [RatingSchema] },
      duration: { type: Number },
      thumbnailImage: { type: String },
      titleImage: { type: String },
      backdropImage: { type: String },
      posterImage: { type: String },
      trailerLink: { type: String },
      language: { type: String },
    },
    { strict: false },
  ),
});

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
  userId: string;
}

const MediaEntityModel = model<IMediaEntity>('Media', MediaEntitySchema);

export { MediaEntityModel };

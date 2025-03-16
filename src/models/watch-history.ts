import mongoose, { Document, Schema } from 'mongoose';
import { MediaEntityModel } from './media-entity';

export interface IWatchHistoryEntry {
  mediaId: string;
  watchedAt: Date;
  watchDuration: number; // in seconds
  progress: number; // percentage 0-100
  watchCount: number;
}

export interface IUserWatchHistory extends Document {
  userId: string;
  history: IWatchHistoryEntry[];
}

const WatchHistoryEntrySchema = new Schema<IWatchHistoryEntry>({
  mediaId: { type: String, required: true },
  watchedAt: { type: Date, default: Date.now },
  watchDuration: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  watchCount: { type: Number, default: 0 },
});

const UserWatchHistorySchema = new Schema<IUserWatchHistory>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    history: [WatchHistoryEntrySchema],
  },
  { timestamps: true },
);

// Create indexes for faster queries
UserWatchHistorySchema.index({ 'history.mediaId': 1 });
UserWatchHistorySchema.index({ 'history.watchedAt': -1 });

export const UserWatchHistoryModel = mongoose.model<IUserWatchHistory>(
  'UserWatchHistory',
  UserWatchHistorySchema,
  'user_watch_history',
);

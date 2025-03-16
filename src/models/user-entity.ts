import mongoose, { Schema, Document } from 'mongoose';

export interface IPersonaUser extends Document {
  id: string;
  fullName: string;
  emailAddress: string;
  avatarUrl: string;
  homeDirectory: string;
  mediaPathList: string[];
}

const PersonaUserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
  avatarUrl: { type: String, required: true },
  homeDirectory: { type: String, required: true },
  mediaPathList: { type: [String], default: [] },
});

export const PersonaUser = mongoose.model<IPersonaUser>('User', PersonaUserSchema);

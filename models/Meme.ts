import mongoose, { Schema, Model } from 'mongoose';

export interface IMeme {
  _id?: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  year: number;
  month: number;
  examples: string[];
  tags: string[];
  source?: string;
  createdAt: Date;
  updatedAt: Date;
  editHistory: {
    editor: string;
    editedAt: Date;
    changes: string;
  }[];
}

const MemeSchema = new Schema<IMeme>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      default: '설명 없음',
    },
    imageUrl: {
      type: String,
      required: false,
      default: 'https://via.placeholder.com/400x300?text=No+Image',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2025,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    examples: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    source: {
      type: String,
      default: '',
    },
    editHistory: [
      {
        editor: { type: String, required: true },
        editedAt: { type: Date, required: true },
        changes: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 인덱스 생성
MemeSchema.index({ year: 1, month: 1 });
MemeSchema.index({ title: 'text', description: 'text' });

const Meme: Model<IMeme> = mongoose.models.Meme || mongoose.model<IMeme>('Meme', MemeSchema);

export default Meme;


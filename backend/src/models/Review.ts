import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const reviewSchema = new Schema(
  {
    nameUser: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  },
);

export type ReviewDocument = InferSchemaType<typeof reviewSchema>;

export const Review: Model<ReviewDocument> =
  (mongoose.models.Review as Model<ReviewDocument>) ??
  mongoose.model<ReviewDocument>("Review", reviewSchema);

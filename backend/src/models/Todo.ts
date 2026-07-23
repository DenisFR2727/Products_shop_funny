import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const TODO_TITLE_MAX_LENGTH = 200;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: TODO_TITLE_MAX_LENGTH,
    },
    userId: {
      type: String,
      required: true,
      immutable: true,
      index: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        const createdAt = ret.createdAt;

        ret.id = String(ret._id);
        ret.createAt =
          createdAt instanceof Date
            ? createdAt.toISOString()
            : String(createdAt ?? "");

        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;

        return ret;
      },
    },
  },
);

todoSchema.index({ userId: 1, createdAt: -1 });

export type TodoDocument = InferSchemaType<typeof todoSchema>;

export const Todo: Model<TodoDocument> =
  (mongoose.models.Todo as Model<TodoDocument>) ??
  mongoose.model<TodoDocument>("Todo", todoSchema, "todos");

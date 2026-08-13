import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";

export const USER_ROLES = ["admin", "tecnico", "recepcion"] as const;

export type UserRole = (typeof USER_ROLES)[number];

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: "admin" },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User =
  (models.User as mongoose.Model<User>) || model<User>("User", userSchema);

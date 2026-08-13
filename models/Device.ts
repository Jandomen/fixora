import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";
import { DEVICE_TYPES } from "@/lib/device";

export { DEVICE_TYPES };

const deviceSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    type: { type: String, enum: DEVICE_TYPES, required: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    serialNumber: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export type Device = InferSchemaType<typeof deviceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Device =
  (models.Device as mongoose.Model<Device>) || model<Device>("Device", deviceSchema);

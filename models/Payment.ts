import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";
import { PAYMENT_METHODS } from "@/lib/payment";

export { PAYMENT_METHODS };

const paymentSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "WorkOrder",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "efectivo",
    },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export type Payment = InferSchemaType<typeof paymentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Payment =
  (models.Payment as mongoose.Model<Payment>) ||
  model<Payment>("Payment", paymentSchema);

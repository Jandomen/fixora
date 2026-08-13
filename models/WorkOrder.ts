import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";
import { WORK_ORDER_STATUSES, type WorkOrderStatus } from "@/lib/work-order";

export { WORK_ORDER_STATUSES };
export type { WorkOrderStatus };

const workOrderSchema = new Schema(
  {
    number: { type: String, required: true, unique: true, trim: true },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    device: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: WORK_ORDER_STATUSES,
      default: "recibida",
    },
    reportedIssue: { type: String, required: true, trim: true },
    diagnosis: { type: String, trim: true },
    estimatedCost: { type: Number, min: 0 },
  },
  { timestamps: true }
);

export type WorkOrder = InferSchemaType<typeof workOrderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const WorkOrder =
  (models.WorkOrder as mongoose.Model<WorkOrder>) ||
  model<WorkOrder>("WorkOrder", workOrderSchema);

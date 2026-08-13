"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  WORK_ORDER_STATUSES,
  type WorkOrderStatus,
} from "@/models/WorkOrder";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Device } from "@/models/Device";
import { WorkOrder } from "@/models/WorkOrder";

function isStatus(value: string): value is WorkOrderStatus {
  return (WORK_ORDER_STATUSES as readonly string[]).includes(value);
}

export type CreateWorkOrderState = {
  error?: string;
};

export async function createWorkOrder(
  _prevState: CreateWorkOrderState,
  formData: FormData
): Promise<CreateWorkOrderState> {
  const customer = formData.get("customer")?.toString() ?? "";
  const device = formData.get("device")?.toString() ?? "";
  const reportedIssue = formData.get("reportedIssue")?.toString().trim() ?? "";
  const estimatedCostRaw = formData.get("estimatedCost")?.toString().trim() ?? "";

  if (!Types.ObjectId.isValid(customer) || !Types.ObjectId.isValid(device)) {
    return { error: "Debes seleccionar un cliente y un equipo." };
  }

  if (!reportedIssue) {
    return { error: "El problema reportado es obligatorio." };
  }

  let estimatedCost: number | undefined;
  if (estimatedCostRaw !== "") {
    estimatedCost = Number(estimatedCostRaw);
    if (!Number.isFinite(estimatedCost) || estimatedCost < 0) {
      return { error: "El costo estimado debe ser un número mayor o igual a cero." };
    }
  }

  await connectDB();

  const [customerDoc, deviceDoc] = await Promise.all([
    Customer.findById(customer).lean(),
    Device.findById(device).lean(),
  ]);

  if (!customerDoc || !deviceDoc) {
    return { error: "El cliente o el equipo seleccionado ya no existe." };
  }

  const count = await WorkOrder.countDocuments();
  const number = `WO-${String(count + 1).padStart(4, "0")}`;

  await WorkOrder.create({
    number,
    customer,
    device,
    reportedIssue,
    ...(estimatedCost !== undefined && { estimatedCost }),
  });

  revalidatePath("/ordenes");
  redirect("/ordenes");
}

export type UpdateWorkOrderState = {
  error?: string;
};

export async function updateWorkOrder(
  _prevState: UpdateWorkOrderState,
  formData: FormData
): Promise<UpdateWorkOrderState> {
  const orderId = formData.get("orderId")?.toString() ?? "";
  const status = formData.get("status")?.toString() ?? "";
  const diagnosis = formData.get("diagnosis")?.toString().trim() ?? "";
  const estimatedCostRaw = formData.get("estimatedCost")?.toString().trim() ?? "";

  if (!Types.ObjectId.isValid(orderId)) {
    return { error: "Orden no válida." };
  }
  if (!isStatus(status)) {
    return { error: "Estado no válido." };
  }

  let estimatedCost: number | undefined;
  if (estimatedCostRaw !== "") {
    estimatedCost = Number(estimatedCostRaw);
    if (!Number.isFinite(estimatedCost) || estimatedCost < 0) {
      return { error: "El costo estimado debe ser un número mayor o igual a cero." };
    }
  }

  await connectDB();

  await WorkOrder.findByIdAndUpdate(orderId, {
    status,
    ...(diagnosis && { diagnosis }),
    ...(estimatedCost !== undefined && { estimatedCost }),
  });

  revalidatePath(`/ordenes/${orderId}`);
  revalidatePath("/ordenes");
  revalidatePath("/dashboard");

  return { error: undefined };
}

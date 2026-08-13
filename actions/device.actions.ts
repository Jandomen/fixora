"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DEVICE_TYPES, type DeviceType } from "@/lib/device";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Device } from "@/models/Device";

function isDeviceType(value: string): value is DeviceType {
  return (DEVICE_TYPES as readonly string[]).includes(value);
}

export type CreateDeviceState = {
  error?: string;
};

export async function createDevice(
  _prevState: CreateDeviceState,
  formData: FormData
): Promise<CreateDeviceState> {
  const customer = formData.get("customer")?.toString() ?? "";
  const type = formData.get("type")?.toString() ?? "";
  const brand = formData.get("brand")?.toString().trim() ?? "";
  const model = formData.get("model")?.toString().trim() ?? "";
  const serialNumber = formData.get("serialNumber")?.toString().trim() ?? "";
  const notes = formData.get("notes")?.toString().trim() ?? "";

  if (!Types.ObjectId.isValid(customer)) {
    return { error: "Debes seleccionar un cliente." };
  }
  if (!isDeviceType(type)) {
    return { error: "El tipo de equipo no es válido." };
  }
  if (!brand) return { error: "La marca es obligatoria." };
  if (!model) return { error: "El modelo es obligatorio." };

  await connectDB();

  const customerDoc = await Customer.findById(customer).lean();
  if (!customerDoc) {
    return { error: "El cliente seleccionado ya no existe." };
  }

  await Device.create({
    customer,
    type,
    brand,
    model,
    ...(serialNumber && { serialNumber }),
    ...(notes && { notes }),
  });

  revalidatePath("/equipos");
  revalidatePath("/ordenes/nueva");
  redirect("/equipos");
}

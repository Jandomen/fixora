"use server";

import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { PAYMENT_METHODS, type PaymentMethod } from "@/lib/payment";
import { connectDB } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { WorkOrder } from "@/models/WorkOrder";

function isMethod(value: string): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}

export type CreatePaymentState = {
  error?: string;
};

export async function createPayment(
  _prevState: CreatePaymentState,
  formData: FormData
): Promise<CreatePaymentState> {
  const orderId = formData.get("orderId")?.toString() ?? "";
  const amountRaw = formData.get("amount")?.toString().trim() ?? "";
  const method = formData.get("method")?.toString() ?? "efectivo";
  const note = formData.get("note")?.toString().trim() ?? "";

  if (!Types.ObjectId.isValid(orderId)) {
    return { error: "Orden no válida." };
  }

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "El monto debe ser un número mayor a cero." };
  }

  if (!isMethod(method)) {
    return { error: "Método de pago no válido." };
  }

  await connectDB();

  const order = await WorkOrder.findById(orderId).lean();
  if (!order) return { error: "La orden ya no existe." };

  await Payment.create({
    order: orderId,
    amount,
    method,
    ...(note && { note }),
  });

  revalidatePath(`/ordenes/${orderId}`);
  revalidatePath("/dashboard");
  revalidatePath("/ordenes");

  return { error: undefined };
}

export async function deletePayment(formData: FormData) {
  const paymentId = formData.get("paymentId")?.toString() ?? "";
  const orderId = formData.get("orderId")?.toString() ?? "";

  if (!Types.ObjectId.isValid(paymentId)) return;

  await connectDB();
  await Payment.findByIdAndDelete(paymentId);

  revalidatePath(`/ordenes/${orderId}`);
  revalidatePath("/dashboard");
  revalidatePath("/ordenes");
}

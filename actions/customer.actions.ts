"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";

export type CreateCustomerState = {
  error?: string;
};

export async function createCustomer(
  _prevState: CreateCustomerState,
  formData: FormData
): Promise<CreateCustomerState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const notes = formData.get("notes")?.toString().trim() ?? "";

  if (!name) return { error: "El nombre del cliente es obligatorio." };
  if (!phone) return { error: "El teléfono es obligatorio." };

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "El correo no tiene un formato válido." };
  }

  await connectDB();

  await Customer.create({
    name,
    phone,
    ...(email && { email }),
    ...(address && { address }),
    ...(notes && { notes }),
  });

  revalidatePath("/clientes");
  redirect("/clientes");
}

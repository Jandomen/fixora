"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { createSession, destroySession } from "@/lib/auth";
import { User } from "@/models/User";

export type LoginState = {
  error?: string;
};

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  await connectDB();

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await createSession({
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "La variable de entorno MONGODB_URI no está definida. Crea el archivo .env en la raíz del proyecto."
  );
}

declare global {
  var mongooseCache: Promise<typeof mongoose> | undefined;
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  if (!globalThis.mongooseCache) {
    globalThis.mongooseCache = mongoose.connect(MONGODB_URI);
  }

  return globalThis.mongooseCache;
}

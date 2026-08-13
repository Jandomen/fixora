import Link from "next/link";
import { DeviceForm } from "@/components/devices/device-form";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { serializeCustomer } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export const metadata = { title: "Nuevo equipo" };

export default async function NewDevicePage() {
  await connectDB();

  const customers = (
    await Customer.find().sort({ name: 1 }).lean()
  ).map(serializeCustomer);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Nuevo equipo</h1>
        <p className="text-sm text-muted-foreground">
          Registra un celular o computadora y asígnalo a su dueño.
        </p>
      </div>

      <DeviceForm customers={customers} />

      <div className="text-sm text-muted-foreground">
        <Link href="/equipos" className="underline">
          Volver a equipos
        </Link>
      </div>
    </div>
  );
}

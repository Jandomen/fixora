import Link from "next/link";
import { OrderForm } from "@/components/work-orders/order-form";
import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { Device } from "@/models/Device";
import { serializeCustomer, serializeDevice } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export const metadata = { title: "Nueva orden" };

export default async function NewOrderPage() {
  await connectDB();

  const [customers, devices] = await Promise.all([
    Customer.find().sort({ name: 1 }).lean(),
    Device.find().sort({ brand: 1, model: 1 }).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Nueva orden</h1>
        <p className="text-sm text-muted-foreground">
          Registra una nueva orden de reparación.
        </p>
      </div>

      <OrderForm
        customers={customers.map(serializeCustomer)}
        devices={devices.map(serializeDevice)}
      />

      <div className="text-sm text-muted-foreground">
        <Link href="/ordenes" className="underline">
          Volver a órdenes
        </Link>
      </div>
    </div>
  );
}

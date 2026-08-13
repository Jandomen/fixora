import Link from "next/link";
import { CustomerForm } from "@/components/customers/customer-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Nuevo cliente" };

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Nuevo cliente</h1>
        <p className="text-sm text-muted-foreground">
          Registra los datos de contacto de un cliente.
        </p>
      </div>

      <CustomerForm />

      <div className="text-sm text-muted-foreground">
        <Link href="/clientes" className="underline">
          Volver a clientes
        </Link>
      </div>
    </div>
  );
}

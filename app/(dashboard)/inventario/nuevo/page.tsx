import Link from "next/link";
import { ProductForm } from "@/components/inventory/product-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Nuevo producto" };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Nuevo producto</h1>
        <p className="text-sm text-muted-foreground">
          Agrega un artículo al inventario.
        </p>
      </div>

      <ProductForm />

      <div className="text-sm text-muted-foreground">
        <Link href="/inventario" className="underline">
          Volver a productos
        </Link>
      </div>
    </div>
  );
}

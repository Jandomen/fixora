import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { connectDB } from "@/lib/mongodb";
import { CATEGORY_LABELS } from "@/lib/product";
import { Product } from "@/models/Product";
import { serializeProduct, type SerializedProduct } from "@/lib/serializers";
import { InventoryFilters } from "@/components/inventory/inventory-filters";

export const dynamic = "force-dynamic";

export const metadata = { title: "Productos" };

function StockBadge({ product }: { product: SerializedProduct }) {
  if (product.stock <= 0) {
    return <Badge variant="destructive">Agotado</Badge>;
  }
  if (product.stock < product.minStock) {
    return <Badge variant="outline">Stock bajo</Badge>;
  }
  return <Badge variant="secondary">{product.stock} uds</Badge>;
}

function formatPrice(value: number | null) {
  return value !== null ? `$${value.toLocaleString("es-MX")}` : "—";
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  await connectDB();

  const { q, category } = await searchParams;
  const query = q?.trim() ?? "";
  const categoryFilter = category ?? "";

  const filter: Record<string, unknown> = {};
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { sku: { $regex: query, $options: "i" } },
      { brand: { $regex: query, $options: "i" } },
    ];
  }
  if (categoryFilter) {
    filter.category = categoryFilter;
  }

  const products = (await Product.find(filter).sort({ name: 1 }).lean()).map(
    serializeProduct
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Inventario de componentes, accesorios y consumibles.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/inventario/nuevo" />}>
          <Plus />
          Nuevo producto
        </Button>
      </div>

      <InventoryFilters q={query} category={categoryFilter} />

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-medium">No se encontraron productos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query || categoryFilter
                ? "Prueba con otros filtros."
                : `Agrega el primero desde ${" "}`}
              {!query && !categoryFilter && (
                <Link
                  href="/inventario/nuevo"
                  className="text-foreground underline"
                >
                  Nuevo producto
                </Link>
              )}
              .
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {products.map((product) => (
              <Card key={product._id}>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span className="truncate">{product.name}</span>
                    <StockBadge product={product} />
                  </CardTitle>
                  <CardDescription>
                    {product.sku}
                    {product.brand ? ` · ${product.brand}` : ""} ·{" "}
                    {CATEGORY_LABELS[product.category]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Precio de venta</span>
                  <span className="font-medium">
                    {formatPrice(product.salePrice)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Listado</CardTitle>
              <CardDescription>{products.length} productos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Precio de venta</TableHead>
                    <TableHead>Costo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.sku}
                          {product.brand ? ` · ${product.brand}` : ""}
                        </div>
                      </TableCell>
                      <TableCell>{CATEGORY_LABELS[product.category]}</TableCell>
                      <TableCell>
                        <StockBadge product={product} />
                      </TableCell>
                      <TableCell>{formatPrice(product.salePrice)}</TableCell>
                      <TableCell>{formatPrice(product.costPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

"use client";

import { useActionState } from "react";
import {
  createProduct,
  type CreateProductState,
} from "@/actions/product.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
} from "@/lib/product";

export function ProductForm() {
  const [state, formAction, isPending] = useActionState<
    CreateProductState,
    FormData
  >(createProduct, {});

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información del producto</CardTitle>
          <CardDescription>
            Registra un artículo de inventario (componentes, accesorios o
            consumibles).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej. Memoria RAM 8GB DDR4"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sku">Código (SKU) *</Label>
            <Input
              id="sku"
              name="sku"
              placeholder="Ej. RAM-8GB-DDR4"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brand">Marca</Label>
            <Input id="brand" name="brand" placeholder="Ej. Kingston" />
          </div>

          <div className="space-y-1.5">
            <Label>Categoría</Label>
            <Select name="category" defaultValue="componente">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" name="stock" type="number" min={0} defaultValue={0} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="minStock">Stock mínimo</Label>
            <Input id="minStock" name="minStock" type="number" min={0} defaultValue={0} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="salePrice">Precio de venta</Label>
            <Input id="salePrice" name="salePrice" type="number" min={0} step="0.01" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="costPrice">Costo</Label>
            <Input id="costPrice" name="costPrice" type="number" min={0} step="0.01" />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Detalles adicionales del producto"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}

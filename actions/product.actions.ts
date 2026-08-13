"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/product";
import { Product } from "@/models/Product";

function isCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

export type CreateProductState = {
  error?: string;
};

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const sku = formData.get("sku")?.toString().trim().toUpperCase() ?? "";
  const brand = formData.get("brand")?.toString().trim() ?? "";
  const category = formData.get("category")?.toString() ?? "componente";
  const stockRaw = formData.get("stock")?.toString().trim() ?? "";
  const minStockRaw = formData.get("minStock")?.toString().trim() ?? "";
  const costPriceRaw = formData.get("costPrice")?.toString().trim() ?? "";
  const salePriceRaw = formData.get("salePrice")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  if (!name) return { error: "El nombre del producto es obligatorio." };
  if (!sku) return { error: "El código (SKU) es obligatorio." };
  if (!isCategory(category)) {
    return { error: "Categoría no válida." };
  }

  const toNumber = (raw: string, field: string) => {
    if (raw === "") return undefined;
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`El campo ${field} debe ser un número mayor o igual a cero.`);
    }
    return value;
  };

  let stock: number | undefined;
  let minStock: number | undefined;
  let costPrice: number | undefined;
  let salePrice: number | undefined;

  try {
    stock = toNumber(stockRaw, "stock");
    minStock = toNumber(minStockRaw, "stock mínimo");
    costPrice = toNumber(costPriceRaw, "costo");
    salePrice = toNumber(salePriceRaw, "precio de venta");
  } catch (error) {
    return { error: (error as Error).message };
  }

  await connectDB();

  const existing = await Product.findOne({ sku });
  if (existing) {
    return { error: `Ya existe un producto con el código ${sku}.` };
  }

  await Product.create({
    name,
    sku,
    ...(brand && { brand }),
    category,
    ...(stock !== undefined && { stock }),
    ...(minStock !== undefined && { minStock }),
    ...(costPrice !== undefined && { costPrice }),
    ...(salePrice !== undefined && { salePrice }),
    ...(description && { description }),
  });

  revalidatePath("/inventario");
  redirect("/inventario");
}

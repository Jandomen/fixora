export const PRODUCT_CATEGORIES = [
  "componente",
  "accesorio",
  "consumible",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  componente: "Componente",
  accesorio: "Accesorio",
  consumible: "Consumible",
};

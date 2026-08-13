import mongoose, { Schema, model, models, InferSchemaType } from "mongoose";
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/lib/product";

export { PRODUCT_CATEGORIES, type ProductCategory };

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    brand: { type: String, trim: true },
    category: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      default: "componente",
    },
    stock: { type: Number, default: 0, min: 0 },
    minStock: { type: Number, default: 0, min: 0 },
    costPrice: { type: Number, min: 0 },
    salePrice: { type: Number, min: 0 },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export type Product = InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product =
  (models.Product as mongoose.Model<Product>) ||
  model<Product>("Product", productSchema);

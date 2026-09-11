import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(100),

  description: z.string().max(500).optional(),

  purchasePrice: z.coerce
    .number()
    .positive("Purchase price must be greater than 0"),

  sellingPrice: z.coerce
    .number()
    .positive("Selling price must be greater than 0"),

  stock: z.coerce.number().min(1).positive("Selling price must be greater than 0"),

  minimumStock: z.coerce.number().min(1).positive("Selling price must be greater than 0"),

  supplierId: z.coerce.number(),

  categoryId: z.coerce.number(),
});

export const ProductUpdateSchema = ProductSchema.extend({
  id: z.number(),
});
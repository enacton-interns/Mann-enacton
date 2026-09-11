import { z } from "zod";

export const PurchaseItemSchema = z.object({
  productId: z.coerce.number().int().positive("Please select a product"),

  quantity: z.coerce.number().positive("Quantity must be greater than 0"),

  purchasePrice: z.coerce
    .number()
    .positive("Purchase price must be greater than 0"),
});

export const PurchaseSchema = z
  .object({
    supplierId: z.coerce.number().int().positive("Please select a supplier"),
    purchaseDate: z.string().min(1, "Purchase date is required"),
    items: z.array(PurchaseItemSchema).min(1, "Add at least one product"),
  })
  .superRefine((data, ctx) => {
    const productIds = data.items.map((item) => item.productId);
    if (new Set(productIds).size !== productIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate products are not allowed.",
        path: ["items"],
      });
    }
  });

export type PurchaseSchemaType = z.infer<typeof PurchaseSchema>;

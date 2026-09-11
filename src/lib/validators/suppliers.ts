import z from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  phone: z.string().min(1, "Phone is required").optional(),
  email: z.string().min(1, "Email is required").email("Invalid email").optional(),
  address: z.string().min(1, "Address is required").optional(),
});

export const supplierUpdateSchema = supplierSchema.extend({
  id: z.number(),
});
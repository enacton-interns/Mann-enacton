import { z } from "zod"

export const CategorySchema = z.object({
    name: z.string().trim().min(3, "Category name must be at least 3 characters").max(100),
})

export const CategoryUpdateSchema = CategorySchema.extend({
    id: z.number(),
})
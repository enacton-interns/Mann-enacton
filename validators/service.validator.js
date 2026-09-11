import { z } from "zod";

// Reusable helper: validates a 24-char hex MongoDB ObjectId string
const mongoId = (fieldName = "id") =>
    z
        .string({ required_error: `${fieldName} is required` })
        .regex(/^[a-f\d]{24}$/i, `${fieldName} must be a valid MongoDB ObjectId`);

// ─── Create Service ───────────────────────────────────────────────────────────
// POST /api/services
export const createServiceSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: "Name is required" })
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters")
            .trim(),
        description: z
            .string({ required_error: "Description is required" })
            .min(10, "Description must be at least 10 characters")
            .max(1000, "Description must be at most 1000 characters")
            .trim(),
        price: z
            .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
            .positive("Price must be a positive number"),
        duration: z
            .number({ required_error: "Duration is required", invalid_type_error: "Duration must be a number" })
            .int("Duration must be a whole number (in minutes)")
            .positive("Duration must be a positive number"),
    }),
});

// ─── Update Service ───────────────────────────────────────────────────────────
// PATCH /api/services/:serviceId
export const updateServiceSchema = z
    .object({
        params: z.object({
            serviceId: mongoId("serviceId"),
        }),
        body: z
            .object({
                name: z
                    .string()
                    .min(2, "Name must be at least 2 characters")
                    .max(100, "Name must be at most 100 characters")
                    .trim()
                    .optional(),
                description: z
                    .string()
                    .min(10, "Description must be at least 10 characters")
                    .max(1000, "Description must be at most 1000 characters")
                    .trim()
                    .optional(),
                price: z
                    .number({ invalid_type_error: "Price must be a number" })
                    .positive("Price must be a positive number")
                    .optional(),
                duration: z
                    .number({ invalid_type_error: "Duration must be a number" })
                    .int("Duration must be a whole number")
                    .positive("Duration must be a positive number")
                    .optional(),
            })
            .refine(
                (data) => Object.keys(data).length > 0,
                { message: "At least one field must be provided to update" }
            ),
    });

// ─── Service ID Param ─────────────────────────────────────────────────────────
// DELETE /api/services/:serviceId
export const serviceIdParamSchema = z.object({
    params: z.object({
        serviceId: mongoId("serviceId"),
    }),
});

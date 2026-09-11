import { z } from "zod";

// Reusable helper: validates a 24-char hex MongoDB ObjectId string
const mongoId = (fieldName = "id") =>
    z
        .string({ required_error: `${fieldName} is required` })
        .regex(/^[a-f\d]{24}$/i, `${fieldName} must be a valid MongoDB ObjectId`);

// ─── Add Service to Provider ──────────────────────────────────────────────────
// POST /api/provider/services
export const addProviderServiceSchema = z.object({
    body: z.object({
        serviceId: mongoId("serviceId"),
    }),
});

// ─── Update Availability ──────────────────────────────────────────────────────
// PATCH /api/provider/services/availability
export const updateAvailabilitySchema = z.object({
    body: z.object({
        availability: z.boolean({
            required_error: "Availability is required",
            invalid_type_error: "Availability must be a boolean (true or false)",
        }),
    }),
});

// ─── Service ID Param ─────────────────────────────────────────────────────────
// GET /api/provider/services/:serviceId
// DELETE /api/provider/services/:serviceId
export const providerServiceIdParamSchema = z.object({
    params: z.object({
        serviceId: mongoId("serviceId"),
    }),
});

import { z } from "zod";

// Reusable helper: validates a 24-char hex MongoDB ObjectId string
const mongoId = (fieldName = "id") =>
    z
        .string({ required_error: `${fieldName} is required` })
        .regex(/^[a-f\d]{24}$/i, `${fieldName} must be a valid MongoDB ObjectId`);

// ─── Create Feedback ──────────────────────────────────────────────────────────
// POST /api/feedback/:bookingId
export const createFeedbackSchema = z.object({
    params: z.object({
        bookingId: mongoId("bookingId"),
    }),
    body: z.object({
        rating: z
            .number({ required_error: "Rating is required", invalid_type_error: "Rating must be a number" })
            .int("Rating must be a whole number")
            .min(1, "Rating must be at least 1")
            .max(5, "Rating must be at most 5"),
        comment: z
            .string({ required_error: "Comment is required" })
            .min(10, "Comment must be at least 10 characters")
            .max(500, "Comment must be at most 500 characters")
            .trim(),
    }),
});

// ─── Get Feedback by Booking ──────────────────────────────────────────────────
// GET /api/feedback/:bookingId
export const getFeedbackSchema = z.object({
    params: z.object({
        bookingId: mongoId("bookingId"),
    }),
});

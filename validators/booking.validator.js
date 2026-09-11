import { z } from "zod";

// Reusable helper: validates a 24-char hex MongoDB ObjectId string
const mongoId = (fieldName = "id") =>
    z
        .string({ required_error: `${fieldName} is required` })
        .regex(/^[a-f\d]{24}$/i, `${fieldName} must be a valid MongoDB ObjectId`);

// ─── Param schema ─────────────────────────────────────────────────────────────
// Used by: GET /:bookingId, DELETE /cancel/:bookingId, PUT /:bookingId
export const bookingIdParamSchema = z.object({
    params: z.object({
        bookingId: mongoId("bookingId"),
    }),
});

// ─── Create Booking ───────────────────────────────────────────────────────────
// POST /api/bookings
// Handles the updated Booking model with isrecurring + recurringDetails
export const createBookingSchema = z.object({
  body: z
    .object({
      serviceId: mongoId("serviceId"),
      bookingDate: z.coerce
        .date({ invalid_type_error: "BookingDate must be a valid date" })
        .refine((d) => d > new Date(), {
          message: "BookingDate must be in the future",
        }),
        recurringBookingId: mongoId("recurringBookingId").optional(),
    })
});

// ─── Accept / Reject / Complete Booking ──────────────────────────────────────
// PUT /api/bookings/:bookingId

export const updateBookingStatusSchema = z.object({
    params: z.object({
        bookingId: mongoId("bookingId"),
    }),
    body: z.object({
        status: z.enum(["accepted", "rejected", "completed"], {
            required_error: "Status is required",
            invalid_type_error:
                "Status must be one of: accepted, rejected, completed",
        }),
    }),
});


export const createRecurringBookingSchema = z.object({
  body: z.object({
    serviceId: mongoId("serviceId"),
    frequency: z.enum(["daily", "weekly", "monthly"], {
      required_error: "Frequency is required",
      invalid_type_error: "Frequency must be one of: daily, weekly, monthly",
    }),
    interval: z
      .number({
        required_error: "Interval is required",
        invalid_type_error: "Interval must be a number",
      })
      .int("Interval must be a whole number")
      .positive("Interval must be a positive number"),
    startDate: z.coerce.date({
      invalid_type_error: "startDate must be a valid date",
    }),
    endDate: z.coerce.date({
      invalid_type_error: "endDate must be a valid date",
    }),
  }),
});

export const updateRecurringBookingSchema = z.object({
  params: z.object({
    id: mongoId("id"),
  }),
  body: z.object({
    serviceId: mongoId("serviceId").optional(),
    frequency: z
      .enum(["daily", "weekly", "monthly"], {
        required_error: "Frequency is required",
        invalid_type_error: "Frequency must be one of: daily, weekly, monthly",
      })
      .optional(),
    interval: z
      .number({
        required_error: "Interval is required",
        invalid_type_error: "Interval must be a number",
      })
      .int("Interval must be a whole number")
      .positive("Interval must be a positive number")
      .optional(),
    startDate: z.coerce
      .date({ invalid_type_error: "startDate must be a valid date" })
      .optional(),
    endDate: z.coerce
      .date({ invalid_type_error: "endDate must be a valid date" })
      .optional(),
  }),
});

export const deleteRecurringBookingSchema = z.object({
  params: z.object({
    id: mongoId("id"),
  }),
});
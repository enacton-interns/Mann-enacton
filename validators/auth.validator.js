import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: "Name is required" })
            .min(4, "Name must be at least 4 characters")
            .max(50, "Name must be at most 50 characters")
            .trim(),
        email: z
            .string({ required_error: "Email is required" })
            .email("Invalid email address")
            .toLowerCase(),
        password: z
            .string({ required_error: "Password is required" })
            .min(8, "Password must be at least 8 characters")
            .max(16, "Password must be at most 16 characters"),
        role: z
            .enum(["customer", "provider", "admin"], {
                message: "Role must be either 'customer' or 'provider'",
            })
            .optional(),
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters"),
  }),
});

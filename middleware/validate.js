import { ZodError } from "zod";

/**
 * Generic Zod validation middleware.
 * Pass a z.object({ body, params, query }) schema.
 * On failure returns 400 with per-field error details.
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: result.error.issues.map((e) => ({
        field: e.path.slice(1).join(".") || e.path.join("."),
        message: e.message,
      })),
    });
  }

  next();
};

export default validate;
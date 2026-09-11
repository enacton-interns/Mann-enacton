import { Router } from "express";
import { handleCreateFeedback, handleGetAllFeedback, handleGetFeedback } from "../controllers/feedback.js";
import validate from "../middleware/validate.js";
import { createFeedbackSchema, getFeedbackSchema } from "../validators/feedback.validator.js";

const router = Router()

// "/" must be defined before "/:bookingId" to prevent route shadowing
router.get("/", handleGetAllFeedback)

router
  .route("/:bookingId")
  .get(validate(getFeedbackSchema), handleGetFeedback)
  .post(validate(createFeedbackSchema), handleCreateFeedback);

export default router;
import { Router } from "express";
import {
  handleCreateBookingOfCustomer,
  handleGetAllBookingOfCustomer,
  handleCancelBooking,
  handleAcceptOrRejectBooking,
  handleGetBooking,
  handleGetActiveBooking,
} from "../controllers/booking.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import validate from "../middleware/validate.js";
import {
  createBookingSchema,
  bookingIdParamSchema,
  updateBookingStatusSchema,
  createRecurringBookingSchema,
  deleteRecurringBookingSchema,
  updateRecurringBookingSchema
} from "../validators/booking.validator.js";
import {
  handleGetAllRecurringBooking,
  handleCreateRecurringBooking,
  handleDeleteRecurringBooking,
  handleUpdateRecurringBooking,
} from "../controllers/recurringbooking.js";

const router = Router();

router.post(
  "/",
  authorizeRoles("customer"),
  validate(createBookingSchema),
  handleCreateBookingOfCustomer,
);

router.get(
  "/history",
  authorizeRoles("customer"),
  handleGetAllBookingOfCustomer,
);

router.get("/active", handleGetActiveBooking);

router
  .route("/recurring")
  .get(handleGetAllRecurringBooking)
  .post(validate(createRecurringBookingSchema), handleCreateRecurringBooking);

router
  .route("/recurring/:id")
  .patch(validate(updateRecurringBookingSchema), handleUpdateRecurringBooking)
  .delete(validate(deleteRecurringBookingSchema), handleDeleteRecurringBooking);


router.delete(
  "/cancel/:bookingId",
  authorizeRoles("customer"),
  validate(bookingIdParamSchema),
  handleCancelBooking,
);

router.get("/:bookingId", validate(bookingIdParamSchema), handleGetBooking);

router.put(
  "/:bookingId",
  authorizeRoles("provider"),
  validate(updateBookingStatusSchema),
  handleAcceptOrRejectBooking,
);

export default router;
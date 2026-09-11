import { Router } from "express";
import {
  handleAddService,
  handleGetServices,
  handleDeleteService,
  handleUpdateAvailability,
  handleGetServiceById,
} from "../controllers/providerservices.js";
import validate from "../middleware/validate.js";
import {
  addProviderServiceSchema,
  updateAvailabilitySchema,
  providerServiceIdParamSchema,
} from "../validators/providerservice.validator.js";

const router = Router()

router
    .route("/")
    .post(validate(addProviderServiceSchema), handleAddService)
    .get(handleGetServices)

// "/availability" must be defined before "/:serviceId" to prevent route shadowing
router.patch("/availability", validate(updateAvailabilitySchema), handleUpdateAvailability)

router.get("/:serviceId", validate(providerServiceIdParamSchema), handleGetServiceById)
router.delete("/:serviceId", validate(providerServiceIdParamSchema), handleDeleteService)

export default router;
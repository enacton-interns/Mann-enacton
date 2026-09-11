import { Router } from "express"
import {
  handleAddService,
  handleGetAllServices,
  handleUpdateService,
  handleDeleteService
} from "../controllers/service.js";
import validate from "../middleware/validate.js";
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema,
} from "../validators/service.validator.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = Router()

const adminOnly = authorizeRoles("admin");

router
  .route("/")
  .post(adminOnly, validate(createServiceSchema), handleAddService)
  .get(handleGetAllServices)

router
  .route("/:serviceId")
  .patch(adminOnly, validate(updateServiceSchema), handleUpdateService)
  .delete(adminOnly, validate(serviceIdParamSchema), handleDeleteService)

  export default router

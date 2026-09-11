import { Router } from "express";
import { handleCreateProject, handleDeleteProject, handleGetAllProjects, handleUpdateProject } from "../controllers/project.js";

const router = Router();

router
    .route("/")
    .get(handleGetAllProjects)
    .post(handleCreateProject)

router.delete("/:id", handleDeleteProject)
router.put("/:id", handleUpdateProject)

export default router
import { Router } from "express";
import { handleCreateTimeTrackForProject, handleGetAllTimeTracks, handleDeleteTimeTrack, handleUpdateTimeTrack, handleExportTimeTrackOfProject, handleSummaryOfProject } from "../controllers/timetrack.js";

const router = Router();

router
    .route("/:projectId")
    .get(handleGetAllTimeTracks)
    .post(handleCreateTimeTrackForProject)

router
    .route("/:projectId/:timeId")
    .delete(handleDeleteTimeTrack)
    .put(handleUpdateTimeTrack)

router.get("/exports/:projectId", handleExportTimeTrackOfProject)

router.get("/summary/:projectId", handleSummaryOfProject)

export default router;
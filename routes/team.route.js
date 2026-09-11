import { Router } from "express";
import isAuth from "../middleware/auth.middleware.js";
import isTeamMember from "../middleware/team.middleware.js";
import { handleCreateTeam, handleGetTeams, handleInviteMember, handleRemoveMember, handleViewTeam } from "../controllers/team.controller.js";
import authorizeRoles from "../middleware/authorize.middleware.js";
import { handleCreateTask, handleDeleteTask, handleGetTasks, handleUpdateTask, handleGetSingleTask } from "../controllers/task.controller.js";

const router = Router();

router.get("/", isAuth, handleGetTeams)
router.post("/create", isAuth, authorizeRoles("admin") , handleCreateTeam)
router.post("/:teamId/invite/", isAuth, authorizeRoles("admin"), isTeamMember, handleInviteMember)

router.delete("/:teamId/remove/", isAuth, authorizeRoles("admin"), isTeamMember, handleRemoveMember)
// router.delete("/:teamId", isAuth, authorizeRoles("admin"), isTeamMember, handleLeaveTeam)    
router.get("/:teamId", isAuth, isTeamMember, handleViewTeam)


//Task routes
router.get("/:teamId/tasks", isAuth, isTeamMember, handleGetTasks);
router.post("/:teamId/tasks", isAuth, authorizeRoles("admin"), isTeamMember, handleCreateTask);
router.get("/:teamId/tasks/:taskId", isAuth, isTeamMember, handleGetSingleTask);
router.delete("/:teamId/tasks/:taskId", isAuth, isTeamMember, handleDeleteTask);
router.patch("/:teamId/tasks/:taskId", isAuth, isTeamMember, handleUpdateTask);


export default router;
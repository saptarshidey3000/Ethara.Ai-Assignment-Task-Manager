import { Router } from "express"

// middlewares
import verifyJWT  from "../middlewares/auth.middleware.js"

import {
  verifyProjectAccess,
  verifyProjectAdmin,
} from "../middlewares/project.middleware.js"

// controllers
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
} from "../controllers/project.controller.js"

const router = Router()

/*
|--------------------------------------------------------------------------
| PROJECT ROUTES
|--------------------------------------------------------------------------
|
| Base Route:
| /api/v1/projects
|
*/

/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
|
| POST /api/v1/projects/create
|
| Protected Route
| Only authenticated users can create projects
|
*/
router.post(
  "/create",
  verifyJWT,
  createProject
)

/*
|--------------------------------------------------------------------------
| Get All Projects
|--------------------------------------------------------------------------
|
| GET /api/v1/projects
|
| Returns all projects where logged in user
| is a member
|
*/
router.get(
  "/",
  verifyJWT,
  getAllProjects
)

/*
|--------------------------------------------------------------------------
| Single Project Routes
|--------------------------------------------------------------------------
|
| GET    /:projectId
| PATCH  /:projectId
| DELETE /:projectId
|
*/
router.route("/:projectId")

  // get single project
  .get(
    verifyJWT,
    verifyProjectAccess,
    getProjectById
  )

  // update project (admin only)
  .patch(
    verifyJWT,
    verifyProjectAccess,
    verifyProjectAdmin,
    updateProject
  )

  // delete project (admin only)
  .delete(
    verifyJWT,
    verifyProjectAccess,
    verifyProjectAdmin,
    deleteProject
  )

/*
|--------------------------------------------------------------------------
| Add Member
|--------------------------------------------------------------------------
|
| POST /api/v1/projects/:projectId/members
|
| Admin Only
|
*/
router.post(
  "/:projectId/members",
  verifyJWT,
  verifyProjectAccess,
  verifyProjectAdmin,
  addMemberToProject
)

/*
|--------------------------------------------------------------------------
| Remove Member
|--------------------------------------------------------------------------
|
| DELETE /api/v1/projects/:projectId/members/:memberId
|
| Admin Only
|
*/
router.delete(
  "/:projectId/members/:memberId",
  verifyJWT,
  verifyProjectAccess,
  verifyProjectAdmin,
  removeMemberFromProject
)

export default router
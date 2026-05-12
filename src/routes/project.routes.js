import { Router } from "express"

// middlewares
import { verifyJWT } from "../middlewares/auth.middleware.js"

import {
  verifyProjectAccess,
} from "../middlewares/project.middleware.js"

// controllers
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
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
| Protected Project Access Routes
|
*/
router.route("/:projectId")

  .get(
    verifyJWT,
    verifyProjectAccess,
    getProjectById
  )

  .patch(
    verifyJWT,
    verifyProjectAccess,
    updateProject
  )

  .delete(
    verifyJWT,
    verifyProjectAccess,
    deleteProject
  )

/*
|--------------------------------------------------------------------------
| Add Member
|--------------------------------------------------------------------------
|
| POST /api/v1/projects/:projectId/members
|
*/
router.post(
  "/:projectId/members",
  verifyJWT,
  verifyProjectAccess,
  addMember
)

/*
|--------------------------------------------------------------------------
| Remove Member
|--------------------------------------------------------------------------
|
| DELETE /api/v1/projects/:projectId/members/:memberId
*/
router.delete(
  "/:projectId/members/:memberId",
  verifyJWT,
  verifyProjectAccess,
  removeMember
)

export default router
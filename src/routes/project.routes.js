import {Router} from "express"
//middlewares
import {verifyJWT} from "../middlewares/auth.middleware.js"
//controllers
import { 
    createProject,
     getAllProjects,
      getProjectById,
       updateProject,
        deleteProject } from "../controllers/project.controller.js"

const router = Router()

/*
|--------------------------------------------------------------------------
| Project Routes
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
| Only logged in users can create projects
|
*/
router.post("/create", verifyJWT, createProject)

/*
|--------------------------------------------------------------------------
| Get All Projects
|--------------------------------------------------------------------------
|
| GET /api/v1/projects
|
| Returns all projects of logged in user
|
*/

router.get("/", verifyJWT, getAllProjects)
/*
|--------------------------------------------------------------------------
| Get Single Project
|--------------------------------------------------------------------------
|
| GET /api/v1/projects/:projectId
|
| Returns detailed project information
|
*/

router.get("/:projectId", verifyJWT, getProjectById)

/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
|
| PATCH /api/v1/projects/:projectId
|
| Updates project details
|
*/
router.patch("/:projectId", verifyJWT, updateProject)
/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
|
| DELETE /api/v1/projects/:projectId
|
| Deletes a project
|
*/
router.delete("/:projectId", verifyJWT, deleteProject)

/*
|--------------------------------------------------------------------------
| Add Member
|--------------------------------------------------------------------------
|
| POST /api/v1/projects/:projectId/members
|
| Adds new member to project
|
*/
router.post("/:projectId/members", verifyJWT, addMember)

/*
|--------------------------------------------------------------------------
| Remove Member
|--------------------------------------------------------------------------
|
| DELETE /api/v1/projects/:projectId/members/:memberId
|
| Removes member from project
|
*/
router.delete("/:projectId/members/:memberId", verifyJWT, removeMember)

export default router



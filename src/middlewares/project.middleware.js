import prisma from "../db/index.js"

import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"

/*
Verify Project Access Middleware
------------------------------------
Responsibilities:
1. Check if project exists
2. Check if user is a member of the project
3. Attach project to request object
4. Continue request
*/
export const verifyProjectAccess = asyncHandler(async (req, res, next) => {
    //get project id from params
    const { projectId } = req.params
    if (!projectId) {
        throw new ApiError(400, "Project id is required")
    }
    //check if project exists and user is a member
    const membership = await prisma.projectMember.findFirst({
        where: {
            projectId,
            userId: req.user.id
        },
        include: {
            project: true
        }
    })
    if (!membership) {
        throw new ApiError(
            404,
            "Project not found or access denied"
        )
    }
    //Attach Data to request object
    req.project = membership.project
    req.projectMember = membership
    next()
})

//verify project admin : checks if user is admin of the project
export const verifyProjectAdmin = asyncHandler(async (req, res, next) => {
 if (!req.projectMember) {
    throw new ApiError(
      403,
      "Project membership not found"
    )
  }

  /*
  |--------------------------------------------------------------------------
  | Admin Role Check
  |--------------------------------------------------------------------------
  */

  if (req.projectMember.role !== "PROJECT_ADMIN") {
    throw new ApiError(
      403,
      "Admin access required"
    )
  }

  next()
})

/*
|--------------------------------------------------------------------------
| Verify Project Owner Middleware
|--------------------------------------------------------------------------
|
| Only project owner can perform
| destructive operations
|
*/
export const verifyProjectOwner = asyncHandler(async (req, res, next) => {
    if (!req.projectMember) {
        throw new ApiError(
            403,
            "Project membership not found"
        )
    }
    if (req.projectMember.role !== "PROJECT_OWNER") {
        throw new ApiError(
            403,
            "Project owner access required"
        )
    }
    next()
})
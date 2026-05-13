import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import prisma from "../prisma/client.js"
import * as projectService from "../services/project.service.js"

//1. create project
const createProject = asyncHandler(async (req, res) => {
  // Validate request body
  const { name, description } = req.body
  if (!name || name.trim() === "") {
    throw new ApiError(400, "Project name is required")
  }
  //call service to create project
  const project = await projectService.createProject({
    name,
    description,
    ownerId: req.user.id
  })
  res.status(201).
  json(new ApiResponse
              (true, 
              "Project created successfully", project))
});
//2. get all projects
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjects(req.user.id)
  res.status(200).json(new ApiResponse(true, "Projects retrieved successfully", projects))
});
//3. get project by id
const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await projectService.getProjectById(projectId, req.user.id)
    if (!project) {
      throw new ApiError(404, "Project not found")
    }
    res.status(200).json(new ApiResponse(true, "Project retrieved successfully", project))
});
//4. update project
const updateProject = asyncHandler(async (req, res) => {

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Update project controller"
    )
  )
});
//5. delete project
const deleteProject = asyncHandler(async (req, res) => {

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Delete project controller"
    )
  )
});
//6. add member to project
const addMemberToProject = asyncHandler(async (req, res) => {
      //get request data
      const { projectId } = req.params
      const { email} = req.body
      //validate request data
      if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is required")
      }
      //call service to add member
      const member = await projectService.addMemberToProject({
        projectId,
        email,
       
      })
  return res.status(200).json(
    new ApiResponse(
      201,
      member,
      "Member added to project successfully"
    )
  )
});
//7. remove member from project
const removeMemberFromProject = asyncHandler(async (req, res) => {
      //get request data
      const { projectId , memberId } = req.params
      //call service to remove member
        await projectService.removeMemberFromProject({
        projectId,
        memberId,
      })
  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Remove member controller"
    )
  )
});

export {
  createProject,
  getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMemberToProject,
    removeMemberFromProject
}
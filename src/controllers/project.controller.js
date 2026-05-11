import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import prisma from "../prisma/client.js"

//1. create project
const createProject = asyncHandler(async (req, res) => {
});
//2. get all projects
const getAllProjects = asyncHandler(async (req, res) => {
});
//3. get project by id
const getProjectById = asyncHandler(async (req, res) => {
});
//4. update project
const updateProject = asyncHandler(async (req, res) => {
});
//5. delete project
const deleteProject = asyncHandler(async (req, res) => {
});
//6. add member to project
const addMemberToProject = asyncHandler(async (req, res) => {
});
//7. remove member from project
const removeMemberFromProject = asyncHandler(async (req, res) => {
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
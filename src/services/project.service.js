import prisma from "../db/index.js"
import ApiError from "../utils/apiError.js"
/*
|--------------------------------------------------------------------------
| Create Project Service
|--------------------------------------------------------------------------
|
| Responsibilities:
| 1. Create project
| 2. Add creator as member
| 3. Assign PROJECT_ADMIN role
| 4. Use transaction safety
|
*/
export const createProject = async ({
    name,
    description, 
    ownerId 
}) => {
     /*
  |--------------------------------------------------------------------------
  | Transaction
  |--------------------------------------------------------------------------
  |
  | If ANY query fails:
  | everything rolls back
  |
  */
  if(!ownerId){
    throw new ApiError(400, "Owner id is required")
  }
    const result = await prisma.$transaction(async (tx) => {
        //1. create project
        const newProject = await tx.project.create({
            data: {
                name,
                description,
                ownerId
            },
        })
        //add creator as member
        await tx.projectMember.create({
            data: {
                userId: ownerId,
                projectId: newProject.id,
                role: "PROJECT_ADMIN"
            },
        })
        return newProject
    })
    //fetch complete project details with members and tasks
    const completeProject = await prisma.project.findUnique({
        where: {
            id: result.id,
        },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            fullname: true,
                            email: true,
                        },
                    },
                },
            },
            tasks: true
        }
    })
    return completeProject;
}

/*
|--------------------------------------------------------------------------
| Get All Projects
|--------------------------------------------------------------------------
|
| Returns all projects where user is member
|
*/
export const getAllProjects = async (userId) => {
    const projects = await prisma.project.findMany({
        where: {
            members: {
                some: {
                    userId ,
                }
            }
        },  
        include: {
            members: {
                select: {
                    userId: true,
                    role: true,
                }
            }
        },
        orderBy:{
            createdAt: "desc"
        }

    })
    return projects;
}

/*
|--------------------------------------------------------------------------
| Get Project By Id
| - project details
| - members
| - tasks
| - analytics
|--------------------------------------------------------------------------
*/
export const getProjectById = async (projectId) => {

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },

    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullname: true,
              email: true,
            },
          },
        },
      },

      tasks: true,
    },
  })

  if (!project) {
    throw new ApiError(404, "Project not found")
  }
  //Analytics
  const totalMembers = project.members.length
  const totalTasks = project.tasks.length
  //task status analytics
  const completedTasks = project.tasks.filter(
    (task) => task.status === "COMPLETED").length
    const pendingTasks = project.tasks.filter(
        (task) => task.status === "PENDING").length

  return {
    ...project, 
    analytics: {
        totalMembers,
        totalTasks,
        completedTasks,
        pendingTasks,
    }
  }
}

/*
|--------------------------------------------------------------------------
| Add Member Service
|--------------------------------------------------------------------------
|
| Responsibilities:
| 1. Verify user exists
| 2. Prevent duplicate membership
| 3. Create membership
|
*/
export const addMember = async ({
    projectId,
    email,
}) => {
    //verify user exists
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    })
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    //prevent duplicate membership
    const existingMembership = await prisma.projectMember.findFirst({
        where: {
            projectId,
            userId: user.id,
        }
    })
    if (existingMembership) {
        throw new ApiError(400, "User is already a member of the project")
    }
    //create membership
    const member = await prisma.projectMember.create({
        data: {
            projectId,
            userId: user.id,
            role: "PROJECT_MEMBER"
        } ,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    fullname: true,
                    email: true,
                }
            }
        }
    })
    return member
}

/*
|--------------------------------------------------------------------------
| Remove Member Service
|--------------------------------------------------------------------------
|
| Responsibilities:
| 1. Verify membership exists
| 2. Prevent owner removal
| 3. Delete membership
|
*/
export const removeMember = async ({
    projectId,
    memberId,
}) => {
    //verify membership exists
    const membership = await prisma.projectMember.findFirst({
        where: {
            projectId,
            userId: memberId,
        } ,
        include: {
            project: true,
        },
    })
    if (!membership) {
        throw new ApiError(404, "Membership not found")
    }
    //prevent owner removal
    if (membership.project.ownerId === memberId) {
        throw new ApiError(400, "Cannot remove project owner")
    }
    //delete membership
    await prisma.projectMember.delete({
        where: {
            id: membership.id,
        }
    })
     return true;   
}

/*
|--------------------------------------------------------------------------
| Update Project Service
|--------------------------------------------------------------------------
|
| Responsibilities:
| 1. Partial update support
| 2. Clean update payload
| 3. Return updated project
|
*/
export const updateProject = async ({
    projectId,
    name,
    description,
    userId,
}) => {
    //build update data object
    const updateData = {}
    if (name !== undefined) {
        updateData.name = name
    }
    if (description !== undefined) {
        updateData.description = description
    }
    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No valid fields to update")
    }
    //update project
    const updatedProject = await prisma.project.updateMany({
        where: {    
            id: projectId,
        },
        data: updateData,
        include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullname: true,
                username: true,
                email: true,
              },
            },
          },
        },

        tasks: true,
      }, 
    })
    return updatedProject;
}

/*
|--------------------------------------------------------------------------
| Delete Project Service
|--------------------------------------------------------------------------
|
| Responsibilities:
| 1. Delete related memberships
| 2. Delete related tasks
| 3. Delete project
| 4. Use transaction safety
|
*/
export const deleteProject = async (projectId) => {
    await prisma.$transaction(async (tx) => {
        //delete memberships
        await tx.projectMember.deleteMany({
            where: {
                projectId,
            }
        })
        //delete tasks
        await tx.task.deleteMany({
            where: {
                projectId,
            }
        })
        //delete project
        await tx.project.delete({
            where: {
                id: projectId,
            }
        })
    })
    return true;
}

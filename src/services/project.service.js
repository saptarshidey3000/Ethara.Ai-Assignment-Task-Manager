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

  return project
}
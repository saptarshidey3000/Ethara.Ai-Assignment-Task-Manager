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
    const result = await prisma.$transaction(async (tx) => {
        //1. create project
        const project = await tx.project.create({
            data: {
                name,
                description,
                ownerId
            },
        })
        //2. add creator as member
        await tx.projectMember.create({
            data: {
                userId: ownerId,
                projectId: project.id,
                role: "PROJECT_ADMIN"
            },
        })
        return project
    })
    return result;
}
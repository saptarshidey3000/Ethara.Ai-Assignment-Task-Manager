import jwt from "jsonwebtoken"

import prisma from "../db/index.js"

/*
|--------------------------------------------------------------------------
| VERIFY JWT MIDDLEWARE
|--------------------------------------------------------------------------
|
| Responsibilities:
|
| 1. Read token
| 2. Verify JWT
| 3. Find user
| 4. Attach req.user
| 5. Continue request
|
*/

const verifyJWT = async (req, res, next) => {
    try {
        //1. Read token
        const token = req.cookies?.accessToken ;
        if(!token){
            return res.status(401)
            .json({ message: "Unauthorized" })
        }
        //2. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET);
        //3. Find user
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            }
        })
        if(!user){
            return res.status(401)
            .json({ message: "Unauthorized" })
        }
        //4. Attach req.user
        req.user = user
        //5. Continue request
        next()

    } catch (error) {
        return res.status(401)
        .json({ message: "Unauthorized" })
    }
}

export default verifyJWT
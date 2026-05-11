import { Router } from "express"
import {
         registerUser,
         loginUser, 
         getCurrentUser,
         refreshToken ,
        logoutUser} 
         from "../controllers/auth.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const router = Router()

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
|
| Base Route: /api/v1/auth
|
| Endpoints:
| POST /register
| POST /login
| POST /logout
| POST /refresh-token
| GET  /me
|
*/

router.post("/register", registerUser)

router.post("/login",  loginUser)

router.post("/logout", verifyJWT ,logoutUser)

router.post("/refresh-token", refreshToken)

router.get("/me", verifyJWT, getCurrentUser)

export default router
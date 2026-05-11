import { Router } from "express"
import {
         registerUser,
         loginUser, 
         getCurrentUser } 
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

router.post("/register")

router.post("/login", loginUser)

router.post("/logout")

router.post("/refresh-token")

router.get("/me", verifyJWT, getCurrentUser)

export default router
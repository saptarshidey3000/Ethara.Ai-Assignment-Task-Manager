import { Router } from "express"

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

router.post("/login")

router.post("/logout")

router.post("/refresh-token")

router.get("/me")

export default router
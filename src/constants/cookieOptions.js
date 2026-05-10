/*
|--------------------------------------------------------------------------
| COOKIE CONFIGURATION
|--------------------------------------------------------------------------
|
| httpOnly:
| Prevents JavaScript access from frontend.
|
| secure:
| HTTPS-only in production.
|
| sameSite:
| Protects against CSRF attacks.
|
*/

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict"
}
import jwt from "jsonwebtoken"

/*
|--------------------------------------------------------------------------
| GENERATE ACCESS TOKEN
|--------------------------------------------------------------------------
*/

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

/*
|--------------------------------------------------------------------------
| GENERATE REFRESH TOKEN
|--------------------------------------------------------------------------
*/

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}
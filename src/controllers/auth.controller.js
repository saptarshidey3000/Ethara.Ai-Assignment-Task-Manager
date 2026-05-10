/*
|--------------------------------------------------------------------------
| AUTH CONTROLLER
|--------------------------------------------------------------------------
|
| Handles:
| - Registration
| - Login
| - Logout
| - Refresh Token
| - Current User
|
*/

/*
|--------------------------------------------------------------------------
| REGISTER USER
|--------------------------------------------------------------------------
|
| FLOW:
|
| 1. Extract input
| 2. Validate fields
| 3. Check existing user
| 4. Hash password
| 5. Create user
| 6. Generate tokens
| 7. Save refresh token
| 8. Send cookies
| 9. Return response
|
*/

import prisma from "../db/index.js"
import hashPassword from "../utils/hashPassword.js"
import { generateAccessToken , generateRefreshToken } from "../utils/generateTokens.js"
import comparepassword from "../utils/comparePassword.js"
import jwt from "jsonwebtoken"
import {cookieOptions} from "../utils/cookieOptions.js"


//1.register user controller

const registerUser = async (req, res) => {
    //1. Extract input
    const { fullname,username , email, password } = req.body
    //2. Validate fields
    if (!fullname || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }
    //3. Check existing user
    const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  })

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists"
    })
  }
    //4. Hash password
    const hashedPassword = await hashPassword(password)
    //5. Create user
    const user = await prisma.user.create({
    data: {
      fullname,
      username,
      email,
      password: hashedPassword
    }
  })
  //6. Generate tokens
  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)
  //7. Save refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id
    }
  })
//sanitize user object
const sanitizedUser = {
  id: user.id,
  fullname: user.fullname,
  username: user.username,
  email: user.email
}

  //8. Send cookies
  res.cookie(
    "refreshToken",
     refreshToken,
    { 
        httpOnly: true, 
        secure: true 
    })
  //9. Return response
  return res
  .status(201)
  .cookie("accessToken", accessToken, cookieOptions)
  .cookie("refreshToken", refreshToken, cookieOptions)
  .json({
    success: true,
    message: "User registered successfully",
    user : sanitizedUser,
    accessToken
  })

}

//2.login user controller

const loginUser = async (req, res) => {

  /*
  |--------------------------------------------------------------------------
  | 1. Extract Input
  |--------------------------------------------------------------------------
  */

  const { email, password } = req.body

  /*
  |--------------------------------------------------------------------------
  | 2. Validate Input
  |--------------------------------------------------------------------------
  */

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    })
  }

  /*
  |--------------------------------------------------------------------------
  | 3. Find User
  |--------------------------------------------------------------------------
  */

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    })
  }

  /*
  |--------------------------------------------------------------------------
  | 4. Compare Password
  |--------------------------------------------------------------------------
  */

  const isPasswordCorrect = await comparePassword(
    password,
    user.password
  )

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    })
  }

  /*
  |--------------------------------------------------------------------------
  | 5. Generate Tokens
  |--------------------------------------------------------------------------
  */

  const accessToken = generateAccessToken(user.id)

  const refreshToken = generateRefreshToken(user.id)

  /*
  |--------------------------------------------------------------------------
  | 6. Save Refresh Token
  |--------------------------------------------------------------------------
  */

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      refreshToken
    }
  })

  /*
  |--------------------------------------------------------------------------
  | 7. Sanitize Response
  |--------------------------------------------------------------------------
  */

  const sanitizedUser = {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email
  }

  /*
  |--------------------------------------------------------------------------
  | 8. Send Response
  |--------------------------------------------------------------------------
  */

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      success: true,
      message: "Login successful",
      user: sanitizedUser
    })
}

//3.logout user controller

//4.refresh token controller

//5.get current user controller


export {
  registerUser,
    loginUser,
    
}
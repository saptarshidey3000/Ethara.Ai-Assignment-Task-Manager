// src/app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/error.middleware.js";

// routes
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";

const app = express();

/*
|--------------------------------------------------------------------------
| CORE MIDDLEWARES
|--------------------------------------------------------------------------
*/

// enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// parse JSON body
app.use(
  express.json({
    limit: "16kb",
  })
);

// parse URL encoded data
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// parse cookies
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

// health routes
app.use("/api/v1/health", healthRouter);

// auth routes
app.use("/api/v1/auth", authRouter);

// project routes
app.use("/api/v1/projects", projectRouter);

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
|
| Must always stay LAST
|
*/
app.use(errorHandler);

export { app };
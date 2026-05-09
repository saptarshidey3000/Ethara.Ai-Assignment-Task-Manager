// src/app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/error.middleware.js";
import healthRouter from "./routes/health.route.js";

const app = express();


// core middlewares

// enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);


// parse JSON data
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

// health check endpoint
app.use("/api/v1/health", healthRouter);

// routes

// health route


// global error middleware (always at the end)
app.use(errorHandler);


export { app };
// health check route

import { Router } from "express";

const router = Router();


// GET /api/v1/health
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});


export default router;
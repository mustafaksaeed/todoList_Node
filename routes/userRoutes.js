import express from "express";

import todoRoutes from "./todoRoutes.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  res.send("welcome to dashboard");
});

router.use("/:id/posts", todoRoutes);

export default router;

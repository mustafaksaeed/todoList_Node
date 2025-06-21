import express from "express";

import todoRoutes from "./todoRoutes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Users Home Page");
});

router.use("/:id/posts", todoRoutes);

export default router;

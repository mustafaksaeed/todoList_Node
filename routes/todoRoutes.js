import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("List of user tasks");
});

router.get("/:todoId", (req, res) => {
  const { todoId } = req.params;
  res.send(`Post ID: ${todoId}`);
});

export default router;

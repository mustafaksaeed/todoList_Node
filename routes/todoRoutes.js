import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("List of user posts");
});

router.get("/:todoId", (req, res) => {
  const { postId } = req.params;
  res.send(`Post ID: ${postId}`);
});

export default router;

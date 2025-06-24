import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("List of user tasks");
});

router.get("/:todoId", (req, res) => {
  const { todoId } = req.params;
  res.send(`Post ID: ${todoId}`);
});

router.post("/todo/create", async (req, res) => {
  try {
    const { tasks } = req.body;

    const task = await Todolist.create({ tasks: tasks });

    res.status(201).json({
      message: "Todo list created successfully!",
      user: {
        id: req.user._id, // Access user ID from the authorized request
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("Error creating todo list:", error);
    res.status(500).json({
      message: "Internal server error while creating todo list.",
      error: error.message,
    });
  }
});

export default router;

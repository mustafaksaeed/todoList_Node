import express from "express";
import Todo from "../models/todo.js";
import User from "../models/user.js";
import mongoose from "mongoose";
const router = express.Router();

router.get("/", async (req, res) => {
  const user = req.user;

  const todos = await Todo.find({ user: user._id });

  return res.status(200).json({
    todos,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);

  if (!todo) {
    res.status(400).json({
      error: "Todo does not exist.",
    });
    return;
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  res.status(200).json({ todo });
});

function validParams(req, res, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Todo ID format." });
  }
}
router.post("/", async (req, res) => {
  try {
    const { body } = req.body;

    const newTodo = await Todo.create({
      body,
      user: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { todos: newTodo._id },
    });

    res.status(201).json({
      newTodo,
    });
  } catch (error) {
    console.error("Error creating todo list:", error);
    res.status(500).json({
      message: "Internal server error while creating todo list.",
      error: error.message,
    });
  }
});

// Toggle Completion Field
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  validParams(req, res, id);
  const todo = await Todo.findById(id);

  if (!todo) {
    res.status(400).json({
      error: "Todo does not exist.",
    });
    return;
  }

  const todoOwned = await Todo.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!todoOwned) {
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }

  todoOwned.completed = !todoOwned.completed;

  await todoOwned.save();

  return res.status(200).json({
    todo,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  validParams(req, res, id);
  const todoExists = await Todo.findById(id);

  if (!todoExists) {
    res.status(400).json({
      error: "Todo does not exist.",
    });
    return;
  }

  const todoOwned = await Todo.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!todoOwned) {
    res.status(400).json({
      error: "Todo is not owned by you",
    });
    return;
  }

  await Todo.findByIdAndDelete(todoOwned._id);

  return res.status(200).json({
    todo: todoOwned,
  });
});

export default router;

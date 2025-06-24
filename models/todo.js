import mongoose, { Schema, model } from "mongoose";

const todoSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Todo = model("Todo", todoSchema);

export default Todo;

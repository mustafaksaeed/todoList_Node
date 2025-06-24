import mongoose from "mongoose";

const todolistSchema = new mongoose.Schema({
  tasks: {
    type: [String],
    required: true,
  },
});

const Todolist = mongoose.model("todolist", todolistSchema);

export default Todolist;

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  description: {
    type: String,
    required: true,
  },
  comments: [
    {
      name: {
        type: String,
      },
      createdDate: {
        type: Date,
      },
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;

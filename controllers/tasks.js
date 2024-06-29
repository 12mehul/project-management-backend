const Task = require("../models/tasks");

//create
const createTask = async (req, res) => {
  try {
    const {
      taskName,
      userId,
      projectId,
      description,
      startDate,
      dueDate,
      status,
    } = req.body;

    if (
      !taskName ||
      !userId ||
      !projectId ||
      !description ||
      !startDate ||
      !dueDate ||
      !status
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const tasks = await Task.create({
      taskName,
      userId,
      projectId,
      description,
      startDate,
      dueDate,
      status,
    });

    return res.status(201).json({ msg: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//list
const getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.query.projectId) {
      query.projectId = req.query.projectId;
    }
    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    const tasks = await Task.find({ query }).sort({ createdAt: -1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//single
const singleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate({
      path: "projectId",
      select: "_id projectName",
    });
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    return res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//update
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    return res.status(200).json({ msg: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//delete
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete({ _id: id });
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    return res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createTask,
  getTasks,
  singleTask,
  updateTask,
  deleteTask,
};

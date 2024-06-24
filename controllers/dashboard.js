const Project = require("../models/projects");
const Task = require("../models/tasks");
const User = require("../models/users");

const userDashboard = async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const totalProjects = await Project.find({ userId });
    const notStartedProjects = await Project.find({
      userId,
      status: "NotStarted",
    });
    const inProgressProjects = await Project.find({
      userId,
      status: "InProgress",
    });
    const completedProjects = await Project.find({
      userId,
      status: "Completed",
    });

    const projects = {
      total: totalProjects.length,
      notStarted: notStartedProjects.length,
      inProgress: inProgressProjects.length,
      completed: completedProjects.length,
    };

    const totalTasks = await Task.find({ userId });
    const todoTasks = await Task.find({ userId, status: "Todo" });
    const inProgressTasks = await Task.find({ userId, status: "InProgress" });
    const inReviewTasks = await Task.find({ userId, status: "InReview" });
    const completedTasks = await Task.find({ userId, status: "Completed" });

    const tasks = {
      total: totalTasks.length,
      todo: todoTasks.length,
      inProgress: inProgressTasks.length,
      inReview: inReviewTasks.length,
      completed: completedTasks.length,
    };

    return res.status(200).json({ projects, tasks });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { userDashboard };

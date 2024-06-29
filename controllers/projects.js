const Project = require("../models/projects");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

//create
const createProject = async (req, res) => {
  try {
    const {
      projectName,
      userId,
      description,
      budget,
      startDate,
      dueDate,
      status,
    } = req.body;
    const file = req.file;

    if (
      !projectName ||
      !userId ||
      !description ||
      !budget ||
      !startDate ||
      !dueDate ||
      !status ||
      !file
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const image = await uploadToCloudinary(file.buffer, "project");

    const projects = await Project.create({
      projectName,
      userId,
      description,
      budget,
      startDate,
      dueDate,
      status,
      img: image.secure_url,
    });

    return res.status(201).json({ msg: "Project created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//list
const getProjects = async (req, res) => {
  try {
    const { userId } = req.query;
    const projects = await Project.find({ userId });
    return res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//single
const singleProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    return res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//update
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    let updatedFile;
    if (file) {
      const image = await uploadToCloudinary(file.buffer, "project");
      updatedFile = image.secure_url;
    } else {
      updatedFile = req.body.img;
    }

    const project = await Project.findByIdAndUpdate(
      { _id: id },
      { ...req.body, img: updatedFile },
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    return res.status(200).json({ msg: "Project updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//delete
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete({ _id: id });
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }
    return res.status(200).json({ msg: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  createProject,
  getProjects,
  singleProject,
  updateProject,
  deleteProject,
};

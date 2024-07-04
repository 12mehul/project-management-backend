const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  singleTask,
  updateTask,
  deleteTask,
  taskStatusUpdate,
  taskCommentUpdate,
} = require("../controllers/tasks");

//create
router.route("/").post(createTask);
//list
router.route("/").get(getTasks);
//single
router.route("/:id").get(singleTask);
//update
router.route("/update/:id").put(updateTask);
//delete
router.route("/delete/:id").delete(deleteTask);
//status update
router.route("/status/:id").put(taskStatusUpdate);
//update task comment
router.route("/comment/:id").post(taskCommentUpdate);

module.exports = router;

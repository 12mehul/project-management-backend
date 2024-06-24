const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createProject,
  getProjects,
  singleProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024, // 200 KB limit
  },
});

//create
router.post("/", upload.single("img"), createProject);
//list
router.route("/").get(getProjects);
//single
router.route("/:id").get(singleProject);
//update
router.put("/update/:id", upload.single("img"), updateProject);
//delete
router.route("/delete/:id").delete(deleteProject);

module.exports = router;

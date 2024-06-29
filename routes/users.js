const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  signup,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { userDashboard } = require("../controllers/dashboard");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024, // 200 KB limit
  },
});

//dashboard
router.route("/dashboard").get(userDashboard);
//signup
router.post("/", upload.single("img"), signup);
//login
router.route("/login").post(login);
//profile
router.route("/profile").get(authMiddleware, getProfile);
//update
router.put("/update/:id", upload.single("img"), updateProfile);

module.exports = router;

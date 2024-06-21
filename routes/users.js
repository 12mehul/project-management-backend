const express = require("express");
const router = express.Router();
const multer = require("multer");
const { signup, login } = require("../controllers/users");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024, // 200 KB limit
  },
});

//signup
router.post("/", upload.single("img"), signup);
//login
router.route("/login").post(login);

module.exports = router;

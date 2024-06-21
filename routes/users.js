const express = require("express");
const router = express.Router();
const multer = require("multer");
const { signup, login } = require("../controllers/users");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

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

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const cloudinary = require("../config/cloudinaryConfig");

//signup
const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const file = req.file;

    if (!firstname || !lastname || !email || !password || !file) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(403).json({ msg: "Email already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const image = await cloudinary.uploader.upload(file.path, {
      folder: "img",
      use_filename: true,
    });

    const users = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      img: image.secure_url,
    });

    return res.status(201).json({ msg: "User created successfully", users });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "1h" });

    return res
      .status(200)
      .json({ msg: "Login successfull!", userId: user._id, token });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
};

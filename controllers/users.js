const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

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

    const image = await uploadToCloudinary(file.buffer, "img");

    const users = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      img: image.secure_url,
    });

    return res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
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

//profile
const getProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById({ _id });
    const { password, ...data } = user.toJSON();
    res.send(data);
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

//update
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    let updatedFile;
    if (file) {
      const image = await uploadToCloudinary(file.buffer, "img");
      updatedFile = image.secure_url;
    } else {
      updatedFile = req.body.img;
    }

    let hashedPassword;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    const users = await User.findOneAndUpdate(
      { _id: id },
      { ...req.body, img: updatedFile, password: hashedPassword },
      { new: true, runValidators: true }
    );
    if (!users) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User updated successfully", users });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
};

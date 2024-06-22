//create a middleware to check if the token is valid
const jwt = require("jsonwebtoken");
// const config = require("config");

module.exports = function (req, res, next) {
  //get the token from the header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send({ msg: "unauthenticated" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

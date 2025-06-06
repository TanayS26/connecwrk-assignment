const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { error } = require("../helper/baseResponse");

const authMiddleware = async (req, res, next) => {
  const userToken = req.headers.authorization;
  if (!userToken) {
    return res
      .status(401)
      .json(error("Please authenticate using a token", 401));
  }

  try {
    let token = userToken.split(" ");
    const JWT_TOKEN = token[1];
    const data = jwt.verify(JWT_TOKEN, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = authMiddleware;

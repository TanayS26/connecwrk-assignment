const { error, success, validateRes } = require("../helper/baseResponse");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).json(error("User not found", 404));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json(error("Invalid Password!", 400));
    }

    const payload = {
      user,
    };
    const jwt_token = await jwt.sign(payload, process.env.JWT_SECRET);

    user = {
      user,
      jwt_token,
    };

    return res.status(200).json(success("Logged in Successfully", user, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = {
  login,
};

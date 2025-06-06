const { error, success, validateRes } = require("../helper/baseResponse");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const createUser = async (req, res) => {
  const user = req.body;
  const newUser = new User(user);

  try {
    const emailExist = await User.findOne({
      email: user.email,
    });

    if (emailExist) {
      return res.status(400).json(error("Email already exists", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    newUser.password = hashedPassword;
    await newUser.save();
    return res
      .status(201)
      .json(success("User Created Successfully", newUser, 201));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Optional: sort newest first

    const totalUsers = await User.countDocuments();

    return res.status(200).json(
      success(
        "Users fetched",
        {
          users,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
        },
        200
      )
    );
  } catch (err) {
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

// auth

module.exports = {
  createUser,
  getAllUser,
};

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/create", UserController.createUser);

router.get(
  "/get-all-users",
  checkAuth,
  authorizeRoles(["Admin"]),
  UserController.getAllUser
);

module.exports = router;

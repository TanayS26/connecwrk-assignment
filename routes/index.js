const express = require("express");
const userRoutes = require("./user");
const authRoutes = require("./auth");
const jobRoutes = require("./job");
const applicationRoutes = require("./application");
const gigRoutes = require("./gig");
const gigOrderRoutes = require("./gigOrder");
const router = new express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/job", jobRoutes);
router.use("/application", applicationRoutes);
router.use("/gig", gigRoutes);
router.use("/gig-order", gigOrderRoutes);

module.exports = router;

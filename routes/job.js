const express = require("express");
const router = express.Router();
const JobController = require("../controllers/job");
const checkAuth = require("../middleware/checkAuth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post(
  "/create",
  checkAuth,
  authorizeRoles(["Recruiter"]),
  JobController.createJob
);

router.get(
  "/list-jobs",
  checkAuth,
  authorizeRoles(["Candidate", "Recruiter", "Admin"]),
  JobController.listJobs
);

router.put(
  "/update/:id",
  checkAuth,
  authorizeRoles(["Recruiter"]),
  JobController.updateJob
);

router.delete(
  "/delete/:id",
  checkAuth,
  authorizeRoles(["Recruiter", "Admin"]),
  JobController.deleteJob
);

module.exports = router;

const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application");
const checkAuth = require("../middleware/checkAuth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post(
  "/:jobId/apply",
  checkAuth,
  authorizeRoles(["Candidate"]),
  applicationController.applyToJob
);

router.get(
  "/my-jobs",
  checkAuth,
  authorizeRoles(["Candidate"]),
  applicationController.viewAppliedJobs
);

module.exports = router;

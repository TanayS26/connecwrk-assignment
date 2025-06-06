const express = require("express");
const router = express.Router();
const gigController = require("../controllers/gig");
const checkAuth = require("../middleware/checkAuth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post(
  "/create",
  checkAuth,
  authorizeRoles(["Freelancer"]),
  gigController.createGig
);

router.put(
  "/update/:id",
  checkAuth,
  authorizeRoles(["Freelancer", "Admin"]),
  gigController.updateGig
);

router.delete(
  "delete/:id",
  checkAuth,
  authorizeRoles(["Freelancer", "Admin"]),
  gigController.deleteGig
);

router.get(
  "/list-gigs",
  checkAuth,
  authorizeRoles(["Recruiter", "Candidate", "Admin"]),
  gigController.listGigs
);

module.exports = router;

const express = require("express");
const router = express.Router();
const gigOrderController = require("../controllers/gigOrder");
const checkAuth = require("../middleware/checkAuth");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post(
  "/:gigId/order",
  checkAuth,
  authorizeRoles(["Recruiter", "Candidate"]),
  gigOrderController.placeGigOrder
);

module.exports = router;

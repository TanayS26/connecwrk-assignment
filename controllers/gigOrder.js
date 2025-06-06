const GigOrder = require("../models/gigOrder");
const Gig = require("../models/gig");
const { success, error } = require("../helper/baseResponse");
const mongoose = require("mongoose");

const placeGigOrder = async (req, res) => {
  try {
    const { gigId } = req.params;
    const buyerId = req.user._id;

    if (req.user.role !== "Recruiter" && req.user.role !== "Candidate") {
      return res
        .status(403)
        .json(
          error(
            "Forbidden: Only Recruiters or Candidates can place gig orders",
            403
          )
        );
    }

    if (!mongoose.isValidObjectId(gigId)) {
      return res.status(400).json(error("Invalid Gig ID", 400));
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json(error("Gig not found", 404));
    }

    if (gig.freelancerId.toString() === buyerId.toString()) {
      return res
        .status(400)
        .json(error("You cannot place an order for your own gig.", 400));
    }

    const existingOrder = await GigOrder.findOne({
      gigId,
      buyerId,
      status: "Pending",
    });
    if (existingOrder) {
      return res
        .status(409)
        .json(error("You already have a pending order for this gig.", 409));
    }

    const newGigOrder = new GigOrder({
      gigId,
      buyerId,
      status: "Pending",
    });

    await newGigOrder.save();

    return res
      .status(201)
      .json(success("Gig order placed successfully", newGigOrder, 201));
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json(error(messages.join(", "), 400));
    }
    console.error("Error placing gig order:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

module.exports = {
  placeGigOrder,
};

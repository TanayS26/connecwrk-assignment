const Gig = require("../models/gig");
const { success, error } = require("../helper/baseResponse");
const mongoose = require("mongoose");

const createGig = async (req, res) => {
  try {
    if (req.user.role !== "Freelancer") {
      return res
        .status(403)
        .json(error("Forbidden: Only Freelancers can create gigs", 403));
    }

    const { title, description, tags, price, deliveryDays } = req.body;

    if (
      !title ||
      !description ||
      price === undefined ||
      deliveryDays === undefined
    ) {
      return res
        .status(400)
        .json(
          error(
            "Title, description, price, and delivery days are required fields.",
            400
          )
        );
    }

    const newGig = new Gig({
      title,
      description,
      tags,
      price,
      deliveryDays,
      freelancerId: req.user._id,
    });

    await newGig.save();
    return res
      .status(201)
      .json(success("Gig created successfully", newGig, 201));
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json(error(messages.join(", "), 400));
    }
    console.error("Error creating gig:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

const updateGig = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, price, deliveryDays } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json(error("Invalid Gig ID", 400));
    }

    let gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json(error("Gig not found", 404));
    }

    if (
      req.user.role === "Freelancer" &&
      gig.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json(
          error("Forbidden: You are not authorized to update this gig", 403)
        );
    }
    if (req.user.role !== "Admin" && req.user.role !== "Freelancer") {
      return res
        .status(403)
        .json(
          error(
            "Forbidden: Only Freelancers (gig owner) or Admins can update gigs",
            403
          )
        );
    }

    if (title) gig.title = title;
    if (description) gig.description = description;
    if (tags) gig.tags = tags;
    if (price !== undefined) gig.price = price;
    if (deliveryDays !== undefined) gig.deliveryDays = deliveryDays;

    await gig.save();

    return res.status(200).json(success("Gig updated successfully", gig, 200));
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json(error(messages.join(", "), 400));
    }
    console.error("Error updating gig:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

const deleteGig = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json(error("Invalid Gig ID", 400));
    }

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json(error("Gig not found", 404));
    }

    if (
      req.user.role === "Freelancer" &&
      gig.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json(
          error("Forbidden: You are not authorized to delete this gig", 403)
        );
    }
    if (req.user.role !== "Admin" && req.user.role !== "Freelancer") {
      return res
        .status(403)
        .json(
          error(
            "Forbidden: Only Freelancers (gig owner) or Admins can delete gigs",
            403
          )
        );
    }

    await gig.deleteOne();

    return res.status(200).json(success("Gig deleted successfully", null, 200));
  } catch (err) {
    console.error("Error deleting gig:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

const listGigs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" };
    }
    if (req.query.description) {
      query.description = { $regex: req.query.description, $options: "i" };
    }
    if (req.query.tags) {
      const tagsArray = req.query.tags
        .split(",")
        .map((s) => new RegExp(s.trim(), "i"));
      query.tags = { $in: tagsArray };
    }
    if (req.query.minPrice && !isNaN(parseFloat(req.query.minPrice))) {
      query.price = { ...query.price, $gte: parseFloat(req.query.minPrice) };
    }
    if (req.query.maxPrice && !isNaN(parseFloat(req.query.maxPrice))) {
      query.price = { ...query.price, $lte: parseFloat(req.query.maxPrice) };
    }
    if (
      req.query.minDeliveryDays &&
      !isNaN(parseInt(req.query.minDeliveryDays))
    ) {
      query.deliveryDays = {
        ...query.deliveryDays,
        $gte: parseInt(req.query.minDeliveryDays),
      };
    }
    if (
      req.query.maxDeliveryDays &&
      !isNaN(parseInt(req.query.maxDeliveryDays))
    ) {
      query.deliveryDays = {
        ...query.deliveryDays,
        $lte: parseInt(req.query.maxDeliveryDays),
      };
    }

    const gigs = await Gig.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalGigs = await Gig.countDocuments(query);

    return res.status(200).json(
      success(
        "Gigs fetched successfully",
        {
          gigs,
          currentPage: page,
          totalPages: Math.ceil(totalGigs / limit),
          totalGigs,
        },
        200
      )
    );
  } catch (err) {
    console.error("Error listing gigs:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

module.exports = {
  createGig,
  updateGig,
  deleteGig,
  listGigs,
};

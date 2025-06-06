const mongoose = require("mongoose");

const gigOrderSchema = mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled"],
      default: "Pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GigOrder = mongoose.model("GigOrder", gigOrderSchema);

module.exports = GigOrder;

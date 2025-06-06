const mongoose = require("mongoose");

let jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      allowNull: true,
    },
    description: {
      type: String,
      required: true,
      allowNull: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    salaryRange: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Job = mongoose.model("Jobs", jobSchema);

module.exports = Job;

const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      allowNull: true,
    },
    email: {
      type: String,
      required: true,
      allowNull: true,
    },
    password: {
      type: String,
      required: true,
      allowNull: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Candidate", "Recruiter", "Freelancer", "Admin"],
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;

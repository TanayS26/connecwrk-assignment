const { error, success, validateRes } = require("../helper/baseResponse");
const Job = require("../models/jobs");
const mongoose = require("mongoose");
require("dotenv").config();

const createJob = async (req, res) => {
  try {
    const { title, description, skills, salaryRange, location, jobType } =
      req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json(error("Title and description are required fields.", 400));
    }

    const newJob = new Job({
      title,
      description,
      skills,
      salaryRange,
      location,
      jobType,
      recruiterId: req.user._id,
    });

    await newJob.save();
    return res
      .status(201)
      .json(success("Job Created Successfully", newJob, 201));
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json(error(messages.join(", "), 400));
    }
    console.error("Error creating job:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, skills, salaryRange, location, jobType } =
      req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json(error("Invalid Job ID", 400));
    }

    let job = await Job.findById(id);

    if (!job) {
      return res.status(404).json(error("Job not found", 404));
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          error("Forbidden: You are not authorized to update this job", 403)
        );
    }

    if (title) job.title = title;
    if (description) job.description = description;
    if (skills) job.skills = skills;
    if (salaryRange) job.salaryRange = salaryRange;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;

    await job.save();

    return res.status(200).json(success("Job Updated Successfully", job, 200));
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json(error(messages.join(", "), 400));
    }
    console.error("Error updating job:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json(error("Invalid Job ID", 400));
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json(error("Job not found", 404));
    }

    if (
      req.user.role === "Recruiter" &&
      job.recruiterId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json(
          error("Forbidden: You are not authorized to delete this job", 403)
        );
    }

    if (req.user.is_admin || req.user.role !== "Recruiter") {
      return res
        .status(403)
        .json(
          error(
            "Forbidden: Only Recruiters (job owner) or Admins can delete jobs",
            403
          )
        );
    }

    await job.deleteOne();

    return res.status(200).json(success("Job Deleted Successfully", null, 200));
  } catch (err) {
    console.error("Error deleting job:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

const listJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: "i" };
    }
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }
    if (req.query.skills) {
      const skillsArray = req.query.skills
        .split(",")
        .map((s) => new RegExp(s.trim(), "i"));
      query.skills = { $in: skillsArray };
    }
    if (req.query.minSalary && !isNaN(parseFloat(req.query.minSalary))) {
    }
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" };
    }
    if (req.query.description) {
      query.description = { $regex: req.query.description, $options: "i" };
    }

    const jobs = await Job.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalJobs = await Job.countDocuments(query);

    return res.status(200).json(
      success(
        "Jobs fetched successfully",
        {
          jobs,
          currentPage: page,
          totalPages: Math.ceil(totalJobs / limit),
          totalJobs,
        },
        200
      )
    );
  } catch (err) {
    console.error("Error listing jobs:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  listJobs,
};

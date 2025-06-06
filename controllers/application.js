const Application = require("../models/application");
const Job = require("../models/jobs");
const { success, error } = require("../helper/baseResponse");
const mongoose = require("mongoose");

const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resumeURL } = req.body;
    const candidateId = req.user._id;

    if (req.user.role !== "Candidate") {
      return res
        .status(403)
        .json(error("Forbidden: Only Candidates can apply for jobs", 403));
    }

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json(error("Invalid Job ID", 400));
    }
    if (
      !resumeURL ||
      typeof resumeURL !== "string" ||
      resumeURL.trim() === ""
    ) {
      return res
        .status(400)
        .json(error("Resume URL is required and must be a valid string.", 400));
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json(error("Job not found", 404));
    }

    const existingApplication = await Application.findOne({
      jobId: jobId,
      candidateId: candidateId,
    });

    if (existingApplication) {
      return res
        .status(409)
        .json(error("You have already applied to this job.", 409));
    }

    const newApplication = new Application({
      jobId,
      candidateId,
      resumeURL: resumeURL.trim(),
    });

    await newApplication.save();

    return res
      .status(201)
      .json(
        success("Job application submitted successfully", newApplication, 201)
      );
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json(error(messages.join(", "), 400));
    }
    console.error("Error applying to job:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

const viewAppliedJobs = async (req, res) => {
  try {
    const candidateId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.user.role !== "Candidate") {
      return res
        .status(403)
        .json(
          error("Forbidden: Only Candidates can view their applied jobs", 403)
        );
    }

    const applications = await Application.find({ candidateId })
      .populate("jobId", "title description location jobType")
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalApplications = await Application.countDocuments({ candidateId });

    return res.status(200).json(
      success(
        "Applied jobs fetched successfully",
        {
          applications,
          currentPage: page,
          totalPages: Math.ceil(totalApplications / limit),
          totalApplications,
        },
        200
      )
    );
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    return res.status(500).json(error("Internal Server Error", 500));
  }
};

module.exports = {
  applyToJob,
  viewAppliedJobs,
};

import prisma from '../db/prisma.mjs';
import jobSchema from '../joi/job.mjs';
// Function to get all jobs
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = prisma.job.findMany();
    res.status(200).json({
      status: `success`,
      jobs: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// Function to create a job
const createJob = async (req, res, next) => {
  try {
    const validData = await jobSchema.validateAsync(value);
    if (validData.error) {
      return next(new Error(validData.error));
    }
    res.status(200).json({
      status: `success`,
    });
  } catch (error) {
    next(error);
  }
};

// Function to get a job by ID
const getJob = async (req, res) => {
  try {
    res.status(200).json({
      status: `success`,
    });
  } catch (error) {
    // Handle error
  }
};

export { getAllJobs, createJob, getJob };

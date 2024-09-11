import prisma from '../db/prisma.mjs';

// Function to get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = prisma.job.findMany();
    res.status(200).json({
      status: `success`,
      jobs: jobs,
    });
  } catch (error) {
    // Handle error
  }
};

// Function to create a job
const createJob = async (req, res) => {
  try {
    res.status(200).json({
      status: `success`,
    });
  } catch (error) {
    // Handle error
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

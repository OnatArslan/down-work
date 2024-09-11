import prisma from '../db/prisma.mjs';
import jobSchema from '../joi/job.mjs';
// Function to get all jobs
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employer: {
          select: {
            username: true,
          },
        },
      },
    });
    res.status(200).json({
      status: `success`,
      jobs: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// Must change req.user after auth controller
const createJob = async (req, res, next) => {
  try {
    const validData = await jobSchema.validateAsync(req.body);
    if (validData.error) {
      return next(new Error(validData.error));
    }
    const newJob = await prisma.job.create({
      data: validData,
      select: {
        employer: true,
      },
    });
    res.status(200).json({
      status: `success`,
      job: newJob,
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

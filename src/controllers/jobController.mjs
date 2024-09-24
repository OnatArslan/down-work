import prisma from '../db/prisma.mjs';
import jobSchema from '../joi/job.mjs';
// Function to get all jobs
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employer: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      omit: {
        updatedAt: true,
        employerId: true,
      },
      orderBy: {
        id: `desc`,
      },
      where: {
        OR: [{ status: `open` }, { status: `progress` }],
      },
    });
    if (jobs.length === 0) {
      return next(new Error(`Can not find any job on server`));
    }
    // Return response with 200 code
    res.status(200).json({
      status: `success`,
      jobs: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// Function to get a job by ID field -
export const getJob = async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({
      where: {
        // Use Number because this is an integer field but req.params.jobId is string
        id: Number(req.params.jobId),
        status: `open`,
      },
      omit: {
        employerId: true,
        updatedAt: true,
      },
      include: {
        employer: {
          select: {
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            proposals: true,
          },
        },
      },
    });
    if (!job) {
      return next(new Error(`Can not find any open job with given ID`));
    }
    res.status(200).json({
      status: `success`,
      job: job,
    });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const validData = await jobSchema.validateAsync({
      ...req.body,
      employerId: req.user.id,
    });
    if (validData.error) {
      return next(new Error(validData.error));
    }
    const newJob = await prisma.job.create({
      data: { ...validData, employerId: req.user.id },
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
      job: newJob,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    if (req.body.employerId || req.body.id) {
      return next(new Error(`Can not update employerId or id`));
    }
    let updatedJob;
    try {
      updatedJob = await prisma.job.update({
        where: {
          id: Number(req.params.jobId),
          employerId: Number(req.user.id),
          status: `open`,
        },
        data: req.body,
      });
    } catch (error) {
      return next(
        new Error(
          `Data is not valid or you are trying to update other persons job post`
        )
      );
    }
    // Send response
    res.status(200).json({
      status: `success`,
      job: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    // If delete record is not done return errror
    try {
      await prisma.job.delete({
        where: {
          id: Number(req.params.jobId),
          employerId: Number(req.user.id),
        },
      });
    } catch (error) {
      return next(
        new Error(
          `Can not find this job post or you are trying to delete other user's post`
        )
      );
    }
    // Send response
    res.status(200).json({
      status: `success`,
      message: `Job deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

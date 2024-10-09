import prisma from "../db/prisma.mjs";
import jobSchema from "../joi/job.mjs";

// #DONE
export const getAllJobs = async (req, res, next) => {
  try {
    // 127.0.0.1:3000/jobs?page=2&sort=salary&order=asc&limit=100&fields=title,budget,location&status=open&paymentType=fixed
    // Get request queries
    const {
      page = 1,
      limit = 100,
      sort = "createdAt",
      order = "desc",
      fields,
      ...filters
    } = req.query;

    // Pagination
    const skip = (page - 1) * limit;
    const limitPerPage = parseInt(limit);
    // Sort
    const sortOptions = {};
    sortOptions[sort] = order === `desc` ? `desc` : `asc`;

    // Get job data
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
        employerId: true,
      },
      orderBy: {
        [sort]: sortOptions[sort],
      },
      // Filter fields
      where: {
        status: `open`,
        ...filters,
      },
      // Pagination
      take: limitPerPage,
      skip: skip,
    });
    // Get job count
    const jobCount = await prisma.job.count({
      where: {
        status: `open`,
      },
      select: {
        _all: true,
      },
    });
    // Return response with 200 code
    res.status(200).json({
      success: true,
      totalJobCount: jobCount._all,
      pageJobCount: jobs.length,
      data: { jobs },
    });
  } catch (error) {
    next(error);
  }
};
// #DONE
export const getJob = async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({
      where: {
        // Use Number because this is an integer field but req.params.jobId is string
        id: Number(req.params.jobId),
        // Only allow showing open types
        status: `open`,
      },
      omit: {
        employerId: true,
      },
      include: {
        employer: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            proposals: true,
          },
        },
      },
    });
    // Return response
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
    let newJob;
    let validData;
    try {
      validData = await jobSchema.parseAsync({
        ...req.body,
        employerId: Number(req.user.id),
      });
    } catch (error) {
      return next(error);
    }
    try {
      newJob = await prisma.job.create({
        data: { ...validData },
        omit: {
          employerId: true,
        },
      });
    } catch (error) {
      return next(error);
    }
    // Send response
    res.status(200).json({
      status: `success`,
      job: validData,
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
      return next(error);
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
          `Can not find this job post or you are trying to delete other user's post`,
        ),
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

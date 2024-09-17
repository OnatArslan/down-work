import prisma from '../db/prisma.mjs';

export const sendProposal = async (req, res, next) => {
  try {
    const { text, price } = req.body;
    if (!req.params.jobId) {
      return next(new Error(`job ID missing`));
    } // Try to get job with given ID and make sure job is open
    const job = await prisma.job.findUnique({
      where: {
        id: Number(req.params.jobId),
        status: 'open',
      },
      include: {
        employer: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    // If job is not find return error
    if (!job) {
      return next(new Error(`Can not find any open job for your proposal`));
    }
    // Check if freelancer already propose for this job
    const isProposalExist = await prisma.proposal.findFirst({
      where: {
        freelancerId: Number(req.user.id),
        jobId: Number(req.params.jobId),
        clientId: Number(job.employerId),
      },
    });
    if (isProposalExist) {
      return next(
        new Error(
          `You already have proposal for this post.Please wait to clients message`
        )
      );
    }
    // Create proposal with given body data
    const newProposal = await prisma.proposal.create({
      data: {
        ...req.body,
        freelancerId: Number(req.user.id),
        jobId: Number(req.params.jobId),
        clientId: Number(job.employerId),
      },
    });
    // If some reason proposal not created return error
    if (!newProposal) {
      return next(new Error(`Can not create proposal`));
    }
    // Send notification to job employer
    const notification = await prisma.notification.create({
      data: {
        subject: `New proposal for ${job.title} job post`,
        text: `Hi there,freelancer ${req.user.username} proposed to your ${job.title} job post.Message him to get contact`,
        receiverId: job.employerId,
      },
    });
    if (!notification) {
      return next(new Error(`Can not send proposal`));
    }
    res.status(200).json({
      status: `success`,
      message: `Hey your proposal is send to user ${job.employer.username} successfully.`,
      data: {
        newProposal,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProposals = async (req, res, next) => {
  try {
    // This if block return proposals for one specific job model
    if (req.params.jobId) {
      const job = await prisma.job.findUnique({
        where: { id: Number(req.params.jobId) },
        include: {
          proposals: {
            orderBy: {
              createdAt: `desc`,
            },
          },
        },
      });
      // If job can not be found return error
      if (!job) {
        return next(new Error(`Can not find any job post with given ID`));
      }
      if (req.user.role === `client`) {
        // If current user is not job's employer
        if (req.user.id !== job.employerId) {
          return next(
            new Error(
              `This post not belong to you.You can not get proposals which not belong to you`
            )
          );
        }
        if (job.proposals.length === 0) {
          return next(new Error(`Can not find any proposal for your job post`));
        }

        res.status(200).json({
          status: `success`,
          message: `Here all proposals for your job post.`,
          proposals: job.proposals,
        });
        // Else block for freelancer role
      } else if (req.user.role === `freelancer`) {
        const proposal = await prisma.proposal.findFirst({
          where: {
            freelancerId: Number(req.user.id),
            jobId: Number(req.params.jobId),
          },
        });
        if (!proposal) {
          return next(
            new Error(
              `Don't have a proposal for this job.For send proposal please send POST request to /job/:jobId/proposals `
            )
          );
        }
        res.status(200).json({
          status: `success`,
          message: `Here is your proposal`,
          proposal,
        });
      }
      // If req.params do not have jobId get all proposals
    } else {
      let proposals;
      if (req.user.role === `client`) {
        proposals = await prisma.proposal.findMany({
          where: {
            clientId: Number(req.user.id),
          },
          omit: {
            freelancerId: true,
            clientId: true,
            jobId: true,
            updatedAt: true,
          },
          include: {
            job: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
            freelancer: {
              select: { username: true, email: true },
            },
          },
        });
        if (!proposals) {
          return next(new Error(`Can not find any proposal for your jobs`));
        }
        res.status(200).json({
          status: `success`,
          message: `Here is your all proposals for your jobs`,
          proposals,
        });
      } else if (req.user.role === `freelancer`) {
        proposals = await prisma.proposal.findMany({
          where: {
            freelancerId: Number(req.user.id),
          },
          omit: {
            updatedAt: true,
            freelancerId: true,
            jobId: true,
            clientId: true,
          },
          include: {
            job: {
              omit: {
                description: true,
                paymentType: true,
                createdAt: true,
                updatedAt: true,
                employerId: true,
              },
              include: {
                employer: {
                  select: {
                    username: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
        if (proposals.length === 0) {
          return next(new Error(`Can not find any proposed jobs`));
        }
        res.status(200).json({
          status: `success`,
          message: `Here is your all proposed jobs`,
          proposals,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// Answer proposal then send Contract
export const answerProposal = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

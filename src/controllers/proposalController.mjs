import prisma from '../db/prisma.mjs';

export const sendProposal = async (req, res, next) => {
  try {
    const { text, price } = req.body;
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
    if (!job) {
      return next(new Error(`Can not any open job for your proposal`));
    }
    if (job.employerId === req.user.id) {
      return next(new Error(`Can not propose your own job post`));
    }

    const newProposal = await prisma.proposal.create({
      data: {
        ...req.body,
        freelancerId: Number(req.user.id),
        jobId: Number(req.params.jobId),
      },
    });
    if (!newProposal) {
      return next(new Error(`Can not create proposal`));
    }

    res.status(200).json({
      status: `success`,
      data: {
        job,
        newProposal,
      },
    });
  } catch (error) {
    next(error);
  }
};

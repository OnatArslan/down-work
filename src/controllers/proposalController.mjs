import prisma from '../db/prisma.mjs';

export const sendProposal = async (req, res, next) => {
  try {
    const { text, price } = req.body;
    // Try to get job with given ID and make sure job is open
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
      return next(new Error(`Can not any open job for your proposal`));
    }
    // If job is current users post return error
    if (job.employerId === req.user.id) {
      return next(new Error(`Can not propose your own job post`));
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

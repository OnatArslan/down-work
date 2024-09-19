import prisma from '../db/prisma.mjs';

export const getAllContracts = async (req, res, next) => {
  try {
    let contracts;
    if (req.user.role === `client`) {
      contracts = await prisma.contract.findMany({
        where: {
          clientId: Number(req.user.id),
        },
        omit: {
          updatedAt: true,
          clientId: true,
          jobId: true,
          freelancerId: true,
        },
        include: {
          freelancer: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });
    } else if (req.user.role === `freelancer`) {
      contracts = await prisma.contract.findMany({
        where: {
          freelancerId: Number(req.user.id),
        },
        omit: {
          updatedAt: true,
          clientId: true,
          jobId: true,
          freelancerId: true,
        },
        include: {
          client: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });
    }
    res.status(200).json({
      status: `success`,
      message: `Here all contracts belongs to you`,
      contracts,
    });
  } catch (error) {
    next(error);
  }
};

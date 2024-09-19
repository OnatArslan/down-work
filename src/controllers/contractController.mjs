import prisma from '../db/prisma.mjs';

export const getAllContracts = async (req, res, next) => {
  try {
    let contracts;
    if (req.user.role === `client`) {
      contracts = await prisma.contract.findMany({
        where: {
          clientId: Number(req.user.id),
        },
        include: {
          freelancer: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });
    } else if (req.user.role === `freelancer`) {
      contracts = await prisma.contract.findMany({
        where: {
          freelancerId: Number(req.user.id),
        },
      });
    }
    res.status(200).json({
      status: `success`,
      contracts,
    });
  } catch (error) {
    next(error);
  }
};

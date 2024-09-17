import prisma from '../db/prisma.mjs';

export const getMe = async (req, res, next) => {
  try {
    let profile;
    if (req.user.role === `client`) {
      profile = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        omit: {
          password: true,
          passwordChangedAt: true,
          updatedAt: true,
        },
        include: {
          _count: {
            select: {
              createdJobs: true,
              recieveddProposals: {
                where: { status: `pending` },
              },
              recievedMessages: true,
              notifications: true,
            },
          },
        },
      });
      // If user's role is freelancer
    } else if (req.user.role === `freelancer`) {
      profile = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        omit: {
          password: true,
          passwordChangedAt: true,
          updatedAt: true,
        },
        include: {
          _count: {
            select: {
              sende,
            },
          },
        },
      });
    }
    // Send status code with profile data
    res.status(200).json({
      status: `success`,
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

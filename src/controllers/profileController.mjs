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
              followedBy: {
                where: {
                  status: `accepted`,
                },
              },
              following: {
                where: {
                  status: `accepted`,
                },
              },
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
          notifications: {
            select: {
              subject: true,
              text: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              sendedProposals: { where: { status: `pending` } },
              receivedReviews: true,
              recievedMessages: true,
              notifications: true,
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

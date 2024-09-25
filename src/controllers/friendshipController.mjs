import prisma from '../db/prisma.mjs';

export const getFollowers = async (req, res, next) => {
  try {
    const followers = await prisma.follows.findMany({
      where: {
        followingId: Number(req.user.id),
        status: `accepted`,
      },
    });
    res.status(200).json({
      status: `success`,
      followers,
    });
  } catch (error) {
    next(error);
  }
};

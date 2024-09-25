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

export const sendFollowRequest = async (req, res, next) => {
  try {
    const following = await prisma.user.findUnique({
      where: {
        id: Number(req.params.followingId),
      },
      select: {
        id: true,
        username: true,
      },
    });
    if (!following) {
      return next(new Error(`Can not find any user with given ID`));
    }
    res.status(200).json({
      status: `success`,
      following,
    });
  } catch (error) {
    next(error);
  }
};

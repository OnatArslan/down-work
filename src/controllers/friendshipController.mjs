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
    // Check if following user exist or id is current user's id
    if (!following || following.id === req.user.id) {
      return next(
        new Error(
          `Can not find any user with given ID or this ID belongs to your account!`
        )
      );
    }
    // Check if already follower
    const isFollower = await prisma.follows.findUnique({
      where: {
        followingId_followedById: {
          followedById: Number(req.user.id),
          followingId: Number(following.id),
        },
        status: `accepted`,
      },
    });
    if (isFollower) {
      return next(
        new Error(`You are already follower of user :${following.username}`)
      );
    }
    let follow;
    try {
      follow = await prisma.follows.create({
        data: {
          followedById: Number(req.user.id),
          followingId: Number(following.id),
        },
      });
    } catch (error) {
      return next(
        new Error(
          `Pending request exist or user declined your first request.You can not spam follow request!!!`
        )
      );
    }
    res.status(200).json({
      status: `success`,
      message: `Follow request successfully sended to user: ${following.username}`,
      follow,
    });
  } catch (error) {
    next(error);
  }
};

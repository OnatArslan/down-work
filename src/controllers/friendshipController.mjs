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

export const getFollowings = async (req, res, next) => {
  try {
    const followings = await prisma.follows.findMany({
      where: {
        followedById: Number(req.user.id),
        status: `accepted`,
      },
    });
    res.status(200).json({
      status: `success`,
      followings,
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

export const getFollowRequests = async (req, res, next) => {
  try {
    const followRequests = await prisma.follows.findMany({
      where: {
        followingId: Number(req.user.id),
        status: `pending`,
      },
      omit: {
        followingId: true,
      },
      include: {
        followedBy: {
          select: {
            username: true,
          },
        },
      },
    });
    res.status(200).json({
      status: `success`,
      followRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    let pendingRequest;
    try {
      pendingRequest = await prisma.follows.update({
        where: {
          followingId_followedById: {
            followingId: Number(req.user.id),
            followedById: Number(req.params.followerId),
          },
        },
        data: {
          status: `accepted`,
        },
      });
    } catch (error) {
      return next(error);
    }
    res.status(200).json({
      status: `success`,
      pendingRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const declineRequest = async (req, res, next) => {
  try {
    let pendingRequest;
    try {
      pendingRequest = await prisma.follows.update({
        where: {
          followingId_followedById: {
            followingId: Number(req.user.id),
            followedById: Number(req.params.followerId),
          },
        },
        data: {
          status: `declined`,
        },
      });
    } catch (error) {
      return next(error);
    }
    res.status(200).json({
      status: `success`,
    });
  } catch (error) {
    next(error);
  }
};

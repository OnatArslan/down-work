import prisma from "../db/prisma.mjs";

export const getFollowers = async (req, res, next) => {
  try {
    const followers = await prisma.follows.findMany({
      where: {
        followingId: Number(req.user.id),
        status: `accepted`,
      },
      omit: {
        followingId: true,
      },
      // Include follower acc
      include: {
        followedBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    res.status(200).json({
      status: `success`,
      message: `You have ${followers.length} followers`,
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
      omit: {
        followedById: true,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    res.status(200).json({
      status: `success`,
      message: `You are following ${followings.length} user`,
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
              `Can not find any user with given ID or this ID belongs to your account!`,
          ),
      );
    }
    // Check if already follower if true return error
    const alreadyFollower = await prisma.follows.findUnique({
      where: {
        followingId_followedById: {
          followedById: Number(req.user.id),
          followingId: Number(following.id),
        },
        status: `accepted`,
      },
    });
    if (alreadyFollower) {
      return next(
          new Error(`You are already follower of user :${following.username}`),
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
              `Pending request exist or user declined your first request.You can not spam follow request!!!`,
          ),
      );
    }
    await prisma.notification.create({
      data: {
        receiverId: Number(follow.followingId),
        subject: `Follow request`,
        text: `${following.username} wants to follow you`,
      },
    });
    res.status(200).json({
      status: `success`,
      message: `Follow request successfully sent to user: ${following.username}`,
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
    await prisma.notification.create({
      data: {
        receiverId: Number(pendingRequest.followedById),
        subject: `Follow request accepted`,
        text: `Hey your follow request accepted.`,
      },
    });
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

export const removeFollower = async (req, res, next) => {
  try {
    let existFollowData;
    try {
      existFollowData = await prisma.follows.update({
        where: {
          followingId_followedById: {
            followedById: Number(req.params.followerId),
            followingId: Number(req.user.id),
          },
          status: `accepted`,
        },
        data: {
          status: `declined`,
        },
        include: {
          followedBy: {
            select: {
              username: true,
            },
          },
        },
      });
    } catch (error) {
      return next(new Error(`Can not find follower with given ID!`));
    }
    res.status(200).json({
      status: `success`,
      message: `${existFollowData.followedBy.username} successfully removed from your followers`,
      existFollowData,
    });
  } catch (error) {
    next(error);
  }
};

export const unFollow = async (req, res, next) => {
  try {
    let existFollowData;
    try {
      existFollowData = await prisma.follows.update({
        where: {
          followingId_followedById: {
            followedById: Number(req.user.id),
            followingId: Number(req.params.followingId),
          },
          status: `accepted`,
        },
        data: {
          status: `declined`,
        },
        include: {
          following: {
            select: {
              username: true,
            },
          },
        },
      });
    } catch (error) {
      return next(new Error(`Can not find follower with given ID!`));
    }
    res.status(200).json({
      status: `success`,
      message: `${existFollowData.following.username} successfully unfollowed.`,
      existFollowData,
    });
  } catch (error) {
    next(error);
  }
};

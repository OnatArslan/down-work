import prisma from '../db/prisma.mjs';

export const getMessages = async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: Number(req.user.id),
            recieverId: Number(req.params.userId),
          },
          {
            senderId: Number(req.params.userId),
            recieverId: Number(req.user.id),
          },
        ],
      },
      omit: {
        updatedAt: true,
        senderId: true,
        recieverId: true,
      },
      include: {
        sender: {
          select: { username: true },
        },
      },
    });
    res.status(200).json({
      status: `success`,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const receiver = await prisma.user.findUnique({
      where: {
        id: Number(req.params.userId),
      },
    });
    if (!receiver) {
      return next(new Error(`Can not find user with given ID`));
    }
    const { text } = req.body;
    let message;
    if (receiver.allowUnknownMessages === true) {
      message = await prisma.message.create({
        data: {
          senderId: Number(req.user.id),
          recieverId: Number(receiver.id),
          text: text,
        },
      });
      res.status(200).json({
        status: `success`,
        message,
      });
    } else {
      // 1) Check if recaiver is following current user
      const isFollowing = await prisma.follows.findUnique({
        where: {
          followingId_followedById: {
            followedById: Number(receiver.id),
            followingId: Number(req.user.id),
          },
          status: `accepted`,
        },
      });

      if (!isFollowing) {
        return next(
          new Error(`${receiver.username} only allow messages from followings`)
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

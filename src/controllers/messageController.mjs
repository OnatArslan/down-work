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
    res.status(200).json({
      status: `success`,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

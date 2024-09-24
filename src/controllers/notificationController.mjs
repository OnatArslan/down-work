import prisma from '../db/prisma.mjs';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: Number(req.user.id),
      },
      take: 20,
      orderBy: {
        createdAt: `desc`,
      },
      omit: {
        id: true,
        updatedAt: true,
        receiverId: true,
      },
    });

    res.status(200).json({
      status: `success`,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

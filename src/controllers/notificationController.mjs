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

export const deleteNotifications = async (req, res, next) => {
  try {
    try {
      await prisma.notification.deleteMany({
        where: {
          receiverId: Number(req.user.id),
        },
      });
    } catch (error) {
      return next(new Error(`Can not delete notifications`));
    }
    res.status(200).json({
      status: `success`,
      message: `All notifications deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    try {
      await prisma.notification.deleteMany({
        where: {
          receiverId: Number(req.user.id),
        },
      });
    } catch (error) {
      return next(new Error(`Can not delete notifications`));
    }
    res.status(200).json({
      status: `success`,
      message: `All notifications deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

import prisma from '../db/prisma.mjs';

export const getNotifications = async (req, res, next) => {
  try {
    res.status(200).json({
      status: `success`,
    });
  } catch (error) {
    next(error);
  }
};

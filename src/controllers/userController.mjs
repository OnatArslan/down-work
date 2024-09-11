// Import any necessary dependencies

import prisma from '../db/prisma.mjs';

// Define the getAllUsers controller function
const getAllUsers = async (req, res, next) => {
  try {
    // Send the response
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

// Export the getAllUsers controller
export { getAllUsers };

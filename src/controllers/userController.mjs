// Import any necessary dependencies
import prisma from '../db/prisma.mjs';
import userSchema from '../joi/job.mjs';

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

// Define the createUser controller function
const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const user = prisma.user.create();
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

// Define the getUser controller function
const getUser = async (req, res, next) => {
  try {
    // Send the response
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

// Export the createUser and getUser controllers
export { getAllUsers, createUser, getUser };

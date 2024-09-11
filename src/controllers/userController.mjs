// Import any necessary dependencies
import prisma from '../db/prisma.mjs';
import userSchema from '../joi/user.mjs';
import bcrypt from 'bcrypt';

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
    const rawData = req.body;
    const validData = await userSchema.validateAsync(rawData);
    if (validData.error) {
      return next(new Error(validData.error));
    }
    delete validData.passwordConfirmation;
    const hashedPassword = await bcrypt.hash(validData.password, 10);

    const freshUser = await prisma.user.create({
      data: {
        ...validData,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      status: `success`,
      user: freshUser,
    });
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

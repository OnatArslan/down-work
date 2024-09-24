// Import any necessary dependencies
import prisma from '../db/prisma.mjs';
import userSchema from '../joi/user.mjs';
import bcrypt from 'bcrypt';

// Define the getAllUsers controller function
const getAllUsers = async (req, res, next) => {
  try {
    // Send the response
    const clients = await prisma.user.findMany({
      omit: {
        password: true,
        passwordChangedAt: true,
      },
      include: {
        _count: {
          select: {
            createdJobs: true,
          },
        },
      },
      where: {
        role: `client`,
      },
    });
    const freelancers = await prisma.user.findMany({
      omit: {
        password: true,
        passwordChangedAt: true,
      },
      where: {
        role: `freelancer`,
      },
      include: {
        _count: {
          select: {
            freelancedContracts: {
              where: {
                status: `complated`,
              },
            },
          },
        },
      },
    });
    res.status(200).json({
      status: `success`,
      clients,
      freelancers,
    });
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

// Define the createUser controller function
const createUser = async (req, res, next) => {
  try {
    // Get raw data from request.body
    const rawData = req.body;
    // Validate data with Joi user schema this will return obj with error if data is not valid
    const validData = await userSchema.validateAsync(rawData);
    // If Data is not valid return next(error)
    if (validData.error) {
      return next(new Error(validData.error));
    }
    // Remove password confirm field from valid data because our Prisma model do not have this field
    delete validData.passwordConfirmation;
    // Hash password
    const hashedPassword = await bcrypt.hash(validData.password, 10);
    // Create new user with hashed password
    const freshUser = await prisma.user.create({
      data: {
        ...validData,
        password: hashedPassword,
      },
    });
    // Return response
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
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

// Export the createUser and getUser controllers
export { getAllUsers, createUser, getUser };

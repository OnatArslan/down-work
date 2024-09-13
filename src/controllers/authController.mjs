import prisma from '../db/prisma.mjs';
import userSchema from '../joi/user.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
  try {
    if (req.body.role) {
      return next(new Error(`Can not give role to yourself!!`));
    }
    // Check given data is valid with userSchema
    const validData = await userSchema.validateAsync(req.body);
    if (validData.error) {
      return next(new Error(validData.error));
    }
    // If data is valid  delete passwordConfirmation
    delete validData.passwordConfirmation;
    // Hash raw password and store in some variable
    const hashedPassword = await bcrypt.hash(validData.password, 10);
    if (!hashedPassword) {
      return next(new Error(`Can not hash password.Please try again later`));
    }
    // Create new user with valid data
    const newUser = await prisma.user.create({
      data: {
        ...validData,
        password: hashedPassword,
      },
      // omit for omit fields from select
      omit: {
        password: true,
      },
    });
    // Create a JWT and send it via cookie
    const token = jwt.sign(newUser, process.env.JWT_SECRET, {
      expiresIn: `2 days`,
    });
    // Send token via cookie
    // Note it token payload contains all user data
    res.cookie(`token`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    });
    // return response and send user data
    res.status(200).json({
      status: `success`,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    // Check credentials if they are not exist return error!
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new Error(`Missing credentials!!`));
    }
    // Find user with given email
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    // If user can not find with given email return error
    if (!user) {
      return next(new Error(`Invalid email`));
    }
    // Check password if false return error
    const checkPassword = await bcrypt.compare(String(password), user.password);
    if (!checkPassword) {
      return next(new Error(`Invalid credentials`));
    }

    // Create token
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: `2 days`,
    });

    // Send token via cookie
    // Note it token payload contains all user data
    res.cookie(`token`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    });

    // Send response with success status code
    res.status(200).json({
      status: `success`,
    });
  } catch (error) {
    next(error);
  }
};

export const logOut = async (req, res, next) => {
  try {
    // Clear jwt token from cookies
    res.clearCookie(`token`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    // Send response with message
    res.status(200).json({
      status: `success`,
      message: `Successfuly logged out.`,
    });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    // First check if token exists; if not, return an error with a clear message
    const token = req.cookies.token;
    if (!token) {
      return next(
        new Error(
          'Token is missing. Please log in to get access to this route.'
        )
      );
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(
        new Error('Token is invalid or expired. Please log in to get access.')
      );
    }

    // Get user from database with token payload data
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    // If user does not exist, return an error and give a message
    if (!user) {
      return next(
        new Error('Account deleted recently. Please sign up for a new account.')
      );
    }

    // Get Unix time from user.passwordChangedAt
    const passwordUnixTimestamp = Math.floor(
      user.passwordChangedAt.getTime() / 1000
    );

    // If user changes password after token is issued, return an error
    if (passwordUnixTimestamp > decoded.iat) {
      return next(
        new Error(
          'User recently changed password. Please log in again to get access.'
        )
      );
    }
    // Attached user to req.user
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

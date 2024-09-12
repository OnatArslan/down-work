import prisma from '../db/prisma.mjs';
import userSchema from '../joi/user.mjs';
import bcrypt from 'bcrypt';

const signUp = async (req, res, next) => {
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
    console.log(validData);

    const newUser = await prisma.user.create({
      data: {
        ...validData,
        password: hashedPassword,
      },
    });
    const users = await prisma.user.findMany();
    res.status(200).json({
      status: `success`,
      //   user: newUser,
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

export { signUp };

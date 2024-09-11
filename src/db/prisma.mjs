import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async signUp(userData) {
        // const hashedPassword = await
      },
    },
  },
});

export default prisma;

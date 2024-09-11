import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
// .$extends({
//   model: {
//     user: {
//       async signUp(userData) {
//         const hashedPassword = await bcrypt.hash(userData.password, 10);
//         return await prisma.user.create({
//           data: {
//             ...userData,
//             password: hashedPassword,
//           },
//         });
//       },
//     },
//   },
// });

export default prisma;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Here define before and after hooks

async function signUp(userData) {}

export default prisma;

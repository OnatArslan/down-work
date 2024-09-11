import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import expressSession from 'express-session';
import { rateLimit } from 'express-rate-limit';

import prisma from './db/prisma.mjs';
import userSchema from './joi/user.mjs';

const app = express();
// Create server based on app
const server = http.createServer(app);
// Using npm package middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(
  expressSession({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get(`/`, async (req, res, next) => {
  const userData = {
    username: `ruya`,
    email: `ruya@gmail.com`,
    password: `123456789`,
    passwordConfirmation: `123456789`,
  };
  const isValid = await userSchema.validateAsync(userData);
  if (isValid.error) {
    return next(new Error(isValid.error));
  }
  const newUser = await prisma.user.create({
    data: userData,
  });
  res.status(200).json({
    message: `hello`,
    user: newUser,
  });
});

// Catch-all route for non-existent routes
app.get(`*`, async (req, res, next) => {
  // const user = await prisma.user.create({});
  res.status(404).json({ error: 'Route not found' });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default server;

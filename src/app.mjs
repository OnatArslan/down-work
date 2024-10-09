// Importing required packages
import express from "express";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import expressSession from "express-session";
import { rateLimit } from "express-rate-limit";

// Import routers
import userRouter from "./routers/userRouter.mjs";
import jobRouter from "./routers/jobRouter.mjs";
import authRouter from "./routers/authRouter.mjs";
import proposalRouter from "./routers/proposalRouter.mjs";
import profileRouter from "./routers/profileRouter.mjs";
import contractRouter from "./routers/contractRouter.mjs";
import messageRouter from "./routers/messageRouter.mjs";
import notificationRouter from "./routers/notificationRouter.mjs";
import friendshipRouter from "./routers/friendshipRouter.mjs";

// Create app
const app = express();

// Create server based on app
const server = http.createServer(app);

// Using npm package middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);
const number = 12;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Use routers on app ---------------------------------------------
app.use(`/users`, userRouter);
app.use(`/jobs`, jobRouter);
app.use(`/auth`, authRouter);
app.use(`/proposals`, proposalRouter);
app.use(`/profile`, profileRouter);
app.use(`/contracts`, contractRouter);
app.use(`/messages`, messageRouter);
app.use(`/notifications`, notificationRouter);
app.use(`/friendship`, friendshipRouter);
// Catch-all route for non-existent routes
app.get(`*`, async (req, res, next) => {
  // const user = await prisma.user.create({});
  res.status(404).json({ error: "Route not found" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.stack });
});

export default server;

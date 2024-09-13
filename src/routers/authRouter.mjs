import express from 'express';
import { signIn, signUp } from '../controllers/authController.mjs';

const router = express.Router();

router.route(`/sign-up`).post(signUp);
router.route(`/sign-in`).post(signIn);
export default router;

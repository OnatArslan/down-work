import express from 'express';
import {
  signIn,
  signUp,
  logOut,
  getMe,
  verify,
} from '../controllers/authController.mjs';

const router = express.Router();

router.route(`/sign-up`).post(signUp);
router.route(`/sign-in`).post(signIn);
router.route(`/log-out`).delete(logOut);
router.route(`/get-me`).get(verify, getMe);
export default router;

import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';

const router = express.Router();

router.route(`/`).get();

export default router;

import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';

const router = express.Router();

router.use(verify);

export default router;

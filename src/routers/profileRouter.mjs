import express from 'express';

import { getMe } from '../controllers/profileController.mjs';
import { verify } from '../controllers/authController.mjs';

const router = express.Router();

router.route(`/`).get(verify, getMe);

export default router;

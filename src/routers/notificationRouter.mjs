import express from 'express';

import { getNotifications } from '../controllers/notificationController.mjs';
import { verify, restrict } from '../controllers/authController.mjs';
const router = express.Router();

router
  .route(`/`)
  .get(verify, restrict([`client`, `freelancer`]), getNotifications);

export default router;

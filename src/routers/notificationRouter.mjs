import express from 'express';

import {
  getNotifications,
  deleteNotifications,
} from '../controllers/notificationController.mjs';
import { verify, restrict } from '../controllers/authController.mjs';
const router = express.Router();

router
  .route(`/`)
  .get(verify, restrict([`client`, `freelancer`]), getNotifications)
  .delete(verify, restrict([`client`, `freelancer`]), deleteNotifications);

export default router;

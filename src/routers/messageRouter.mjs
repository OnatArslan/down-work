import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';
import {
  getMessages,
  sendMessage,
  deleteMessages,
} from '../controllers/messageController.mjs';

const router = express.Router();

router.use(verify);

router
  .route(`/:userId`)
  .get(getMessages)
  .post(sendMessage)
  .delete(deleteMessages);

export default router;

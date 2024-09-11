import express from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
} from '../controllers/userController.mjs';

const router = express.Router();

router.route(`/`).get(getAllUsers).post(createUser);

export default router;

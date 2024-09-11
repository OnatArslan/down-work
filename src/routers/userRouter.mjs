import express from 'express';
import { getAllUsers } from '../controllers/userController.mjs';
const router = express.Router();

router.route(`/`).get(getAllUsers);

export default router;

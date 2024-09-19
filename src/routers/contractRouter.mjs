import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';
import { getAllContracts } from '../controllers/contractController.mjs';
const router = express.Router();

router
  .route(`/`)
  .get(verify, restrict([`client`, `freelancer`]), getAllContracts);

export default router;

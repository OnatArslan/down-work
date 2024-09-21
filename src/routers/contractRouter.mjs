import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';
import {
  getAllContracts,
  cancelContract,
} from '../controllers/contractController.mjs';
const router = express.Router();

router
  .route(`/`)
  .get(verify, restrict([`client`, `freelancer`]), getAllContracts);

router
  .route(`/:contractId`)
  .delete(verify, restrict([`client`, `freelancer`]), cancelContract);

export default router;

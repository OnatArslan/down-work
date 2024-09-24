import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';
import {
  getAllContracts,
  cancelContract,
  complateContract,
} from '../controllers/contractController.mjs';
const router = express.Router();

router
  .route(`/`)
  .get(verify, restrict([`client`, `freelancer`]), getAllContracts);

router
  .route(`/:contractId/cancel`)
  .patch(verify, restrict([`client`, `freelancer`]), cancelContract);

router
  .route(`/:contractId/complate`)
  .patch(verify, restrict([`client`, `freelancer`]), complateContract);

export default router;

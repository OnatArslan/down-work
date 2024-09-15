import express from 'express';
import { verify } from '../controllers/authController.mjs';
import { sendProposal } from '../controllers/proposalController.mjs';
const router = express.Router({ mergeParams: true });

router.route(`/`).post(verify, sendProposal);

export default router;

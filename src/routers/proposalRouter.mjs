import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';
import { sendProposal } from '../controllers/proposalController.mjs';
const router = express.Router({ mergeParams: true });

router.route(`/`).post(verify, restrict([`freelancer`]), sendProposal);

export default router;

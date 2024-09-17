import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';
import {
  sendProposal,
  getProposals,
} from '../controllers/proposalController.mjs';
const router = express.Router({ mergeParams: true });

router.route(`/`).post(verify, restrict([`freelancer`]), sendProposal);

// This is allowed for job/:jobId/proposals and /proposals
router
  .route(`/`)
  .get(verify, restrict([`freelancer`, `client`]))
  .get(getProposals);
export default router;

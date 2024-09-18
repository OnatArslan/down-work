import express from 'express';
import { verify, restrict } from '../controllers/authController.mjs';
import {
  sendProposal,
  getProposals,
  answerProposal,
} from '../controllers/proposalController.mjs';
const router = express.Router({ mergeParams: true });

// This route is for jobs/jobId/proposals route can not use like /proposals
router.route(`/`).post(verify, restrict([`freelancer`]), sendProposal);

// This is allowed for job/:jobId/proposals and /proposals
router
  .route(`/`)
  .get(verify, restrict([`freelancer`, `client`]))
  .get(getProposals);

router
  .route(`/:proposalId/accept`)
  .post(verify, restrict([`client`]), answerProposal);
export default router;

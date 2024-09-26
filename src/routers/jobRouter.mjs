import express from 'express';
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.mjs';

import { verify, restrict } from '../controllers/authController.mjs';
import proposalRouter from './proposalRouter.mjs';

const router = express.Router();

// Use proposal router for this routes---
router.use(`/:jobId/proposals`, proposalRouter);

router.route(`/`).get(getAllJobs);
router.route(`/:jobId`).get(getJob);

// This is auth and authz middleware for protecting routes
router.use(verify, restrict([`client`]));

router.route(`/`).post(createJob);
router.route(`/:jobId`).patch(updateJob).delete(deleteJob);

export default router;

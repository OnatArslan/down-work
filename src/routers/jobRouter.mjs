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
router.route(`/`).post(verify, restrict([`client`]), createJob);

router.route(`/:jobId`).get(getJob);
router.route(`/:jobId`).patch(verify, updateJob).delete(verify, deleteJob);

export default router;

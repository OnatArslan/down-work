import express from 'express';
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
} from '../controllers/jobController.mjs';

import { verify } from '../controllers/authController.mjs';

const router = express.Router();

router.route(`/`).get(getAllJobs).post(verify, createJob);

router.route(`/:jobId`).get(getJob).patch(verify, updateJob);

export default router;

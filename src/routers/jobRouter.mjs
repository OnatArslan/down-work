import express from 'express';
import {
  getAllJobs,
  getJob,
  createJob,
} from '../controllers/jobController.mjs';

const router = express.Router();

router.route(`/`).get(getAllJobs).post(createJob);

router.route(`/:jobId`).get(getJob);

export default router;

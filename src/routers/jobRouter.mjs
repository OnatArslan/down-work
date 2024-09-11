import express from 'express';
import {} from '../controllers/jobController.mjs';

const router = express.Router();

router.route(`/`).get().post();

export default router;

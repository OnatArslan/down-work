import express from 'express';

import { verify, restrict } from '../controllers/authController.mjs';

import { getFollowers } from '../controllers/friendshipController.mjs';

const router = express.Router();

router
  .route(`/followers`)
  .get(verify, restrict([`client`, `freelancer`]), getFollowers);

export default router;

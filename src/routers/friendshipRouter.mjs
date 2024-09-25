import express from 'express';

import { verify, restrict } from '../controllers/authController.mjs';

import {
  getFollowers,
  sendFollowRequest,
} from '../controllers/friendshipController.mjs';

const router = express.Router();

router
  .route(`/followers`)
  .get(verify, restrict([`client`, `freelancer`]), getFollowers);

router
  .route(`/:followingId/follow`)
  .post(verify, restrict([`client`, `freelancer`]), sendFollowRequest);

export default router;

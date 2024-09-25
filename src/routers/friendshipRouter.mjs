import express from 'express';

import { verify, restrict } from '../controllers/authController.mjs';

import {
  getFollowers,
  sendFollowRequest,
  getFollowRequests,
} from '../controllers/friendshipController.mjs';

const router = express.Router();

router.use(verify, restrict([`client`, `freelancer`]));

router.route(`/followers`).get(getFollowers);

router.route(`/:followingId/follow`).post(sendFollowRequest);

router.route(`/requests`).get(getFollowRequests);

export default router;

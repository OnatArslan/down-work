import express from 'express';

import { verify, restrict } from '../controllers/authController.mjs';

import {
  getFollowers,
  sendFollowRequest,
  getFollowRequests,
  acceptRequest,
  declineRequest,
} from '../controllers/friendshipController.mjs';

const router = express.Router();

router.use(verify, restrict([`client`, `freelancer`]));

router.route(`/followers`).get(getFollowers);

router.route(`/:followingId/follow`).post(sendFollowRequest);

router.route(`/requests`).get(getFollowRequests);

router.route(`/requests/:requestId/accept`).patch(acceptRequest);
router.route(`/requests/:requestId/decline`).patch(declineRequest);

export default router;

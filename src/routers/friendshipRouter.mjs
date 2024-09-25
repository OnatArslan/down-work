import express from 'express';

import { verify, restrict } from '../controllers/authController.mjs';

import {
  getFollowers,
  sendFollowRequest,
  getFollowRequests,
  acceptRequest,
  declineRequest,
  getFollowings,
  removeFollower,
} from '../controllers/friendshipController.mjs';

const router = express.Router();

router.use(verify, restrict([`client`, `freelancer`]));

router.route(`/followers`).get(getFollowers);

router.route(`/followers/:followerId`).patch(removeFollower);

router.route(`/followings`).get(getFollowings);

router.route(`/:followingId/follow`).post(sendFollowRequest);

router.route(`/requests`).get(getFollowRequests);

router.route(`/requests/:followerId/accept`).patch(acceptRequest);
router.route(`/requests/:followerId/decline`).patch(declineRequest);

export default router;

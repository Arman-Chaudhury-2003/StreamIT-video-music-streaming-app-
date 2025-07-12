import { Router } from "express";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
  getSubscribersOfUser,
  getSubscribedChannels,
  getSubscriptionStats,
} from "../controllers/subs.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Subscribe to a channel
router.route("/subscribe/:channelId").post(verifyJWT, subscribeToChannel);

// Unsubscribe from a channel
router
  .route("/unsubscribe/:channelId")
  .delete(verifyJWT, unsubscribeFromChannel);

// Get all subscribers of a user (e.g., channel's followers)
router.route("/subscribers/:userId").get(verifyJWT, getSubscribersOfUser);

// Get all channels the current user is subscribed to
router.route("/subscribed").get(verifyJWT, getSubscribedChannels);

// Get stats: total subscribers & subscriptions of current user
router.route("/stats").get(verifyJWT, getSubscriptionStats);

export default router;

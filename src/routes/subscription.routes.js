import { Router } from "express";
import {
  getSubscribedChannels,       // get channels a user subscribed to
  getUserChannelSubscribers,   // get subscribers of a channel
  toggleSubscription,          // subscribe/unsubscribe toggle
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Protect all routes

// ✅ Get subscribers of a specific channel + toggle subscription
router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers)  // get all subscribers of a channel
  .post(toggleSubscription);       // toggle subscribe/unsubscribe

// ✅ Get all channels that a user subscribed to
router
  .route("/u/:subscriberId")
  .get(getSubscribedChannels);     // get all channels the user subscribed to

export default router;

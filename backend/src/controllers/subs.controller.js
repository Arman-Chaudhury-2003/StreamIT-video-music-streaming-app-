import { Subscription } from "../models/subs.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/APIResponse.js";
import mongoose from "mongoose";

// Subscribe to a channel
const subscribeToChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (req.user._id.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existingSub = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (existingSub) {
    throw new ApiError(400, "Already subscribed to this channel");
  }

  await Subscription.create({
    channel: channelId,
    subscriber: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Subscribed successfully"));
});

// Unsubscribe from a channel
const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const deletedSub = await Subscription.findOneAndDelete({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (!deletedSub) {
    throw new ApiError(404, "Subscription not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Unsubscribed successfully"));
});

// Get all subscribers of a specific user
const getSubscribersOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const subscribers = await Subscription.find({ channel: userId }).populate(
    "subscriber",
    "username fullName avatar"
  );

  const result = subscribers.map((s) => s.subscriber);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Subscribers fetched"));
});

// Get all channels the current user is subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subs = await Subscription.find({ subscriber: req.user._id }).populate(
    "channel",
    "username fullName avatar"
  );

  const result = subs.map((s) => s.channel);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Subscribed channels fetched"));
});

// Get subscription stats for the current user
const getSubscriptionStats = asyncHandler(async (req, res) => {
  const subscribersCount = await Subscription.countDocuments({
    channel: req.user._id,
  });

  const subscribedToCount = await Subscription.countDocuments({
    subscriber: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribersCount, subscribedToCount },
        "Subscription stats fetched"
      )
    );
});

export {
  subscribeToChannel,
  unsubscribeFromChannel,
  getSubscribersOfUser,
  getSubscribedChannels,
  getSubscriptionStats,
};

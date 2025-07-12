import mongoose from "mongoose";
const { Schema } = mongoose;

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true }); // prevent duplicate subs

export const Subscription = mongoose.model("Subscription", subscriptionSchema);

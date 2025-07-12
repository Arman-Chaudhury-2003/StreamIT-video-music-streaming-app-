import { useState } from "react";
import { subscribe, unsubscribe } from "../api/subApi";

export default function SubscribeButton({ channelId, isInitiallySubscribed }) {
  const [isSubscribed, setIsSubscribed] = useState(isInitiallySubscribed);

  const handleClick = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe(channelId);
        setIsSubscribed(false);
      } else {
        await subscribe(channelId);
        setIsSubscribed(true);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-1 text-sm font-medium rounded ${
        isSubscribed ? "bg-gray-400" : "bg-blue-600"
      } text-white hover:opacity-80`}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}

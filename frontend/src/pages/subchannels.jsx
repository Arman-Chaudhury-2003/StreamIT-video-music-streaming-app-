import { useEffect, useState } from "react";
import { getSubscribedChannels } from "../api/subApi";

export default function SubscribedChannels() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    getSubscribedChannels()
      .then((res) => setChannels(res.data.data))
      .catch((err) => console.error("Error fetching subs", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Subscribed Channels</h2>
      {channels.length === 0 ? (
        <p>You are not subscribed to any channels yet.</p>
      ) : (
        <ul className="space-y-4">
          {channels.map((ch) => (
            <li key={ch._id} className="flex items-center space-x-3">
              <img
                src={ch.avatar}
                alt="avatar"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{ch.fullName}</p>
                <p className="text-gray-500">@{ch.username}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

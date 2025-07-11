import React from "react";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  return (
    <Link
      to={`/watch/${video._id}`}
      className="block shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {video.description}
        </p>
      </div>
    </Link>
  );
};

export default VideoCard;

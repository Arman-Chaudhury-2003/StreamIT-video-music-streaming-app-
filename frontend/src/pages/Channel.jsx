import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import userApi from "../api/axios";

export default function Channel() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    userApi
      .get(`/c/${username}`)
      .then((res) => setChannel(res.data))
      .catch((err) => console.error("Channel not found", err));
  }, [username]);

  if (!channel) return <p>Loading channel...</p>;

  return (
    <div>
      <h2>{channel.username}'s Channel</h2>
      <img src={`http://localhost:8000/${channel.coverImage}`} width="300" />
      <ul>
        {channel.videos?.map((vid, idx) => (
          <li key={idx}>
            <h4>{vid.title}</h4>
            <video width="400" controls>
              <source
                src={`http://localhost:8000${vid.url}`}
                type="video/mp4"
              />
            </video>
          </li>
        ))}
      </ul>
    </div>
  );
}

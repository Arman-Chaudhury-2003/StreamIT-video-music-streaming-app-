import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import videoApi from "../api/videoApi";
import { getSubscriptionStats } from "../api/subApi";
import { getSubscribedChannels, getMySubscribers } from "../api/subApi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    uploads: 0,
    views: 0,
    subscribersCount: 0,
    subscribedToCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [activeTab, setActiveTab] = useState("subscribers");
  const [subscribers, setSubscribers] = useState([]);
  const [subscribedTo, setSubscribedTo] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const [subsRes, subbedToRes] = await Promise.all([
        getMySubscribers(user._id),
        getSubscribedChannels(),
      ]);
      setSubscribers(subsRes.data);
      setSubscribedTo(subbedToRes.data);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  });

  useEffect(() => {
    if (user) fetchSubscriptions();
  }, [user]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/c/${user.username}`
    );
    alert("Profile link copied to clipboard!");
  };

  const fetchProfileData = async () => {
    try {
      const [userRes, videoRes, subStatsRes] = await Promise.all([
        userApi.get("/current-user"),
        videoApi.get("/me"),
        getSubscriptionStats(),
      ]);

      const userData = userRes.data.data;
      const videoData = videoRes.data.data;

      const uploads = videoData.length;
      const views = videoData.reduce(
        (acc, video) => acc + (video.views || 0),
        0
      );

      setUser(userData);
      setStats({
        uploads,
        views,
        subscribersCount: subStatsRes.data.data.subscribersCount,
        subscribedToCount: subStatsRes.data.data.subscribedToCount,
      });
    } catch (err) {
      console.error(
        "Error fetching profile:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditForm({
      fullName: user?.fullName || "",
      email: user?.email || "",
    });
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await userApi.patch("/update-details", {
        fullName: editForm.fullName,
        email: editForm.email,
      });

      if (newAvatar) {
        const avatarForm = new FormData();
        avatarForm.append("avatar", newAvatar);
        await userApi.patch("/avatar", avatarForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (newCoverImage) {
        const coverForm = new FormData();
        coverForm.append("coverImage", newCoverImage);
        await userApi.patch("/cover-image", coverForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Profile updated successfully.");
      setEditing(false);
      fetchProfileData();
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (!user)
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load profile.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      {/* Cover Image */}
      {(newCoverImage || user.coverImage) && (
        <img
          src={
            newCoverImage ? URL.createObjectURL(newCoverImage) : user.coverImage
          }
          alt="Cover"
          className="w-full h-40 object-cover rounded-xl mb-4"
        />
      )}

      <button
        onClick={handleCopyLink}
        className="mt-2 text-sm text-blue-600 underline hover:text-blue-800"
      >
        Copy Profile Link
      </button>

      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <img
          src={newAvatar ? URL.createObjectURL(newAvatar) : user.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />

        <div className="flex-1">
          {editing ? (
            <>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                placeholder="Full Name"
                className="block w-full p-2 mt-1 border rounded-lg"
              />

              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Email"
                className="block w-full p-2 mt-2 border rounded-lg"
              />

              <div className="mt-3">
                <label className="block text-sm font-medium">
                  Change Avatar:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewAvatar(e.target.files[0])}
                  className="mt-1"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium">
                  Change Cover Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCoverImage(e.target.files[0])}
                  className="mt-1"
                />
              </div>

              <div className="mt-4 space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">{user.fullName}</h2>
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-gray-700 mt-1">{user.email}</p>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                <p>📹 Uploads: {stats.uploads}</p>
                <p>👁️ Total Views: {stats.views}</p>
                <p>👥 Subscribers: {stats.subscribersCount}</p>
                <p>➡️ Subscribed To: {stats.subscribedToCount}</p>
              </div>

              <button
                onClick={handleEdit}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </>
          )}
          <div className="mt-6">
            <div className="flex gap-4 border-b mb-3">
              <button
                className={`pb-2 ${
                  activeTab === "subscribers"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("subscribers")}
              >
                Subscribers ({subscribers.length})
              </button>
              <button
                className={`pb-2 ${
                  activeTab === "subscribedTo"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("subscribedTo")}
              >
                Subscribed ({subscribedTo.length})
              </button>
            </div>

            <div className="space-y-2">
              {activeTab === "subscribers" &&
                subscribers.map((user) => (
                  <div key={user._id} className="flex items-center gap-2">
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <p>
                      {user.fullName} (@{user.username})
                    </p>
                  </div>
                ))}

              {activeTab === "subscribedTo" &&
                subscribedTo.map((user) => (
                  <div key={user._id} className="flex items-center gap-2">
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <p>
                      {user.fullName} (@{user.username})
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

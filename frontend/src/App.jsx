import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRouted";
import ChangePassword from "./pages/ChangePassword";
import Home from "./pages/Home";
import UploadVideo from "./pages/upload.jsx";
import MyVideos from "./video/myVideos.jsx";
import WatchVideo from "./pages/watchVideo.jsx";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-videos"
          element={
            <ProtectedRoute>
              <MyVideos />
            </ProtectedRoute>
          }
        />
        <Route path="/watch/:videoId" element={<WatchVideo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

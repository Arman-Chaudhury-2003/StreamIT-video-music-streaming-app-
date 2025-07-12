import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../utils/token.js";
import { getCurrentUser } from "../api/userApi.js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const isLogged = isAuthenticated();
      setLoggedIn(isLogged);

      if (isLogged) {
        try {
          const res = await getCurrentUser();
          setCurrentUser(res.data.data);
        } catch (err) {
          console.error("Error fetching current user", err);
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkAuth();
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    setLoggedIn(false);
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/" className="font-semibold text-lg">
            StreamIt
          </Link>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {!loggedIn && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {loggedIn && currentUser && (
            <>
              <Link
                to="/upload"
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white"
              >
                Upload
              </Link>

              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  onClick={() => setIsOpen(!isOpen)}
                  className="h-8 w-8 rounded-full cursor-pointer border-2 border-white"
                />
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-videos"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Videos
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../utils/token.js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setLoggedIn(false);
    navigate("/login");
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-gray-700 hover:text-blue-600">
        Home
      </Link>
      <Link to="/upload" className="text-gray-700 hover:text-blue-600">
        Upload
      </Link>
      {loggedIn ? (
        <>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-gray-700 hover:text-blue-600">
            Login
          </Link>
          <Link to="/register" className="text-gray-700 hover:text-blue-600">
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          StreamIt
        </Link>

        <div className="hidden md:flex space-x-6">
          <NavLinks />
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            ☰
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col space-y-2 px-4">
          <NavLinks />
        </div>
      )}
    </nav>
  );
}

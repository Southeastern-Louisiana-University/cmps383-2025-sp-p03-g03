import React, { useState, useRef, useEffect } from "react";
// import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../components/authContext";

const UserDropdown: React.FC = () => {
  const { setIsAuthenticated, isAuthenticated, role, setUserId, setRole } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    var logOutUrl = "api/authentication/logout";
    fetch(logOutUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).finally(() => {
      setIsAuthenticated(false);
      setUserId(null);
      setRole(null);
      window.location.reload();
    });
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button onClick={() => setIsOpen(!isOpen)}>
        <FaUserCircle
          size={32}
          className="text-white transition-transform hover:scale-110 cursor-pointer"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Profile
          </Link>
          {isAuthenticated && role?.includes("Admin") && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/authContext";
import { FaUserCircle } from "react-icons/fa";

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
    <div ref={dropdownRef} className="relative z-[1001]">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <FaUserCircle
          size={32}
          className="text-indigo-200 transition-transform hover:scale-110 cursor-pointer hover:drop-shadow-xl hover:shadow-indigo-500/50"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-indigo-300 rounded-md shadow-lg shadow-indigo-900/50 z-[1002]">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            Profile
          </Link>
          {isAuthenticated && role?.includes("Admin") && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;

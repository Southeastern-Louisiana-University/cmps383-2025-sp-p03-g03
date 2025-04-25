import  { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";

interface UserProfile {
  id: number;
  userName?: string | null;
  roles?: string[] | null;
  createdOn?: string | null;
}

function ProfilePage() {
  const { isAuthenticated, userId, role } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/users/current", {
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Please log in to view your profile");
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error("Invalid response format from server");
        }

        const data: UserProfile = await response.json();
        setProfile(data);
      } catch (fetchError) {
        console.warn("Fetch failed, using authContext data:", fetchError);
        // Normalize role to string[]
        const normalizedRole = role
          ? Array.isArray(role)
            ? role
            : [role]
          : ["User"];
        setProfile({
          id: parseInt(userId || "0") || 0,
          userName: "Unknown",
          roles: normalizedRole,
          createdOn: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, userId, role, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl text-indigo-300 animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl text-red-500 font-bold">Error</div>
          <p className="text-gray-300 mt-2">{error}</p>
          {error.includes("log in") && (
            <Link
              to="/login"
              className="mt-4 inline-block px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-600 transition-all duration-300"
            >
              Go to Login
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl text-red-500 font-bold">
            No Profile Found
          </div>
          <p className="text-gray-300 mt-2">Unable to load profile data.</p>
          <Link
            to="/movies"
            className="mt-4 inline-block px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-600 transition-all duration-300"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  const displayName = profile.userName || "Unknown";
  // Normalize role for display
  const normalizedRole =
    profile.roles && profile.roles.length > 0
      ? profile.roles
      : role
      ? Array.isArray(role)
        ? role
        : [role]
      : ["User"];
  const displayRole = normalizedRole[0] || "User";
  //const displayCreatedOn = profile.createdOn
  //  ? new Date(profile.createdOn).toLocaleDateString("en-US", {
  //      year: "numeric",
  //      month: "long",
  //      day: "numeric",
  //    })
  //  : "Unknown";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-indigo-300 mb-6 text-center">
          User Profile
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <p className="text-gray-300 text-lg">{displayName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role
            </label>
            <p className="text-gray-300 text-lg">{displayRole}</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/movies"
            className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-600 transition-all duration-300"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

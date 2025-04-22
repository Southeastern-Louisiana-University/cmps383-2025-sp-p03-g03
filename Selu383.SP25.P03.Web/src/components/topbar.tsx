import Headroom from "react-headroom";
import LDTheatreLogo from "../assets/lionsdencinemas.svg";
import "../routes/App.css";
import { Link } from "react-router-dom";
import { useAuth } from "./authContext";
import UserDropdown from "./userIconDropdown";

export default function TopBar() {
  const { isAuthenticated } = useAuth();
  return (
    <Headroom className="z-[1000] relative headroom-wrapper" pinStart={0}>
      <nav className="bg-gray-900 outline-3 outline-indigo-300 shadow-lg shadow-indigo-900/50 p-2 flex justify-between items-center relative z-50">
        {/* Logo Section */}
        <div className="ml-4 md:ml-8 flex space-x-8 md:space-x-16">
          <Link to="/">
            <img
              src={LDTheatreLogo}
              className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50"
              alt="Theater logo"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="mr-4 md:mr-8 lg:mr-24 flex space-x-4 md:space-x-8 lg:space-x-16 items-center">
          <Link to="/movies">
            <h2 className="text-lg md:text-xl lg:text-2xl text-indigo-200 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
              Movies
            </h2>
          </Link>
          <Link to="/MyTickets">
            <h2 className="text-lg md:text-xl lg:text-2xl text-indigo-200 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
              My Tickets
            </h2>
          </Link>
          <Link to="/about">
            <h2 className="text-lg md:text-xl lg:text-2xl text-indigo-200 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
              About
            </h2>
          </Link>
          <Link to="/theaters">
            <h2 className="text-lg md:text-xl lg:text-2xl text-indigo-200 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
              My Theater
            </h2>
          </Link>
          <Link to="/Concessions">
            <h2 className="text-lg md:text-xl lg:text-2xl text-indigo-200 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
              Concessions
            </h2>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center">
              <UserDropdown />
            </div>
          ) : (
            <Link to="/LoginPage">
              <h2 className="text-lg md:text-xl lg:text-2xl text-indigo-200 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
                Log In/Sign Up
              </h2>
            </Link>
          )}
        </div>
      </nav>
    </Headroom>
  );
}

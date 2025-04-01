import Headroom from "react-headroom";
import LDTheatreLogo from "../assets/lionsdencinemas.svg";
import "../routes/App.css";
import { Link } from "react-router-dom";
import { useAuth } from "./authContext";
import UserDropdown from "./userIconDropdown";

export default function TopBar() {
  const { isAuthenticated } = useAuth();
  return (
    <Headroom className="topbar" style={{ zIndex: 1000 }}>
      <nav className="bg-indigo-300! shadow-lg! shadow-indigo-900/50! p-2 flex justify-between items-center ">
        <div className="ml-8 flex space-x-16">
          <Link to="/">
            <img
              src={LDTheatreLogo}
              className="h-24 w-24 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50"
              alt="Vite logo"
            />
          </Link>
        </div>
        <div className="mr-24 flex space-x-16 justify-center!">
          <Link to="/movies">
            <h2 className="text-2xl text-white transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50! cursor-pointer">
              Movies
            </h2>
          </Link>

          {/*<Link to="/">*/}
          {/*  <h2 className="text-2xl text-white transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50! cursor-pointer">*/}
          {/*    Showtimes*/}
          {/*  </h2>*/}
          {/*</Link>*/}

          <Link to="/">
            <h2 className="text-2xl text-white transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50! cursor-pointer">
              About
            </h2>
          </Link>
          <Link to="/">
            <h2 className="text-2xl text-white transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50! cursor-pointer">
              My Theater
            </h2>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/MyTickets">
                <h2 className="text-2xl text-white transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
                  My Tickets
                </h2>
              </Link>
              <UserDropdown />
            </div>
          ) : (
            <Link to="/LoginPage">
              <h2 className="text-2xl text-white transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
                Log In/Sign Up
              </h2>
            </Link>
          )}
        </div>
      </nav>
    </Headroom>
  );
}

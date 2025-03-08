import Headroom from "react-headroom";
import LDTheatreLogo from "../assets/lionsdentheatreslogo.svg";
import "../routes/App.css";

export default function TopBar() {
  return (
    <Headroom className="topbar" style={{ zIndex: 1000 }}>
      <nav className="bg-yellow-400 shadow-lg shadow-green-500/50 p-2 flex justify-between items-center">
        <div className="ml-8 flex space-x-8 space-x-16">
          <a href="./" target="_blank">
            <img
              src={LDTheatreLogo}
              className="h-24 w-24 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-green-500/50"
              alt="Vite logo"
            />
          </a>
        </div>
        <div className="mr-24 flex space-x-16">
          <h2 className="text-2xl transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-green-500/50 cursor-pointer">
            Movies
          </h2>
          <h2 className="text-2xl transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-green-500/50 cursor-pointer">
            Showtimes
          </h2>
          <h2 className="text-2xl transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-green-500/50 cursor-pointer">
            Events
          </h2>
          <h2 className="text-2xl transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-green-500/50 cursor-pointer">
            About
          </h2>
          <h2 className="text-2xl transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-green-500/50 cursor-pointer">
            My Theater
          </h2>
          <h2 className="text-2xl transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-green-500/50 cursor-pointer">
            Q&A
          </h2>
          <h2 className="text-2xl transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-green-500/50 cursor-pointer">
            Log In/Sign Up
          </h2>
        </div>
      </nav>
    </Headroom>
  );
}

import Headroom from "react-headroom";
import LDTheatreLogo from "../assets/lionsdencinemas.svg";
import "../routes/App.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";
import UserDropdown from "./userIconDropdown";
import { useCart } from "./CartContext";
import { PiShoppingCartBold } from "react-icons/pi";

export default function TopBar() {
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  const handleCartClick = () => {
    if (cart.length === 0) {
      // Optional: Show a better UI message instead of alert
      alert("Your cart is empty. Please add some items first!");
    } else {
      navigate("/checkout", {
        state: {},
      });
    }
  };

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
        <div className="mr-3 md:mr-6 lg:mr-10 flex space-x-4 md:space-x-8 lg:space-x-12 items-center">
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
              Menu
            </h2>
          </Link>
          <div
            onClick={handleCartClick}
            className="relative flex items-center cursor-pointer"
          >
            <span className="text-lg">
              <PiShoppingCartBold
                size={33}
                className="text-indigo-200 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50"
              />
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center">
              <UserDropdown />
            </div>
          ) : (
            <Link to="/LoginPage">
              <h2 className="text-lg md:text-xl lg:text-2xl text-indigo-200 transition-transform hover:scale-110 hover:drop-shadow-xl hover:shadow-indigo-500/50 cursor-pointer">
                Log In
              </h2>
            </Link>
          )}
        </div>
      </nav>
    </Headroom>
  );
}

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import UserDropdown from "../Dropdowns/UserDropdown";
import "../BackendCSS/Backend.css"
import "../../../routes/App.css"

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [collapseShow, setCollapseShow] = useState<string>("hidden");

    const handleToggle = (value: string) => {
        setCollapseShow(value);
    };

    // Improved active link detection using React Router's useLocation
    const getNavLinkClass = (path: string): string => {
        return "text-xs uppercase py-3 font-bold block " +
            (location.pathname.includes(path)
                ? "text-lightBlue-500 hover:text-lightBlue-600"
                : "text-blueGray-700 hover:text-blueGray-500");
    };

    const getIconClass = (path: string): string => {
        return (location.pathname.includes(path)
            ? "opacity-75"
            : "text-blueGray-300");
    };

    return (
        <>
            <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-indigo-300 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    <button
                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() => handleToggle("bg-white m-2 py-3 px-6")}
                    >
                        <i className="fas fa-bars"></i>
                    </button>

                    <Link
                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                        to="/"
                    >
                        Lion's Den Cinemas
                    </Link>

                    <ul className="md:hidden items-center flex flex-wrap list-none">
                        <li className="inline-block relative">
                            <NotificationDropdown />
                        </li>
                        <li className="inline-block relative">
                            <UserDropdown />
                        </li>
                    </ul>

                    <div
                        className={
                            "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
                            collapseShow
                        }
                    >
                        <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <Link
                                        className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                                        to="/"
                                    >
                                        Lions Den Cinemas
                                    </Link>
                                </div>
                                <div className="w-6/12 flex justify-end">
                                    <button
                                        type="button"
                                        className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                                        onClick={() => handleToggle("hidden")}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <form className="mt-6 mb-4 md:hidden">
                            <div className="mb-3 pt-0">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="border-0 px-3 py-2 h-12 border border-solid border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                                />
                            </div>
                        </form>

                        <hr className="my-4 md:min-w-full" />
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            Admin Layout Pages
                        </h6>

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/dashboard")} to="/admin/dashboard">
                                    <i className={`fas fa-tv mr-2 text-sm ${getIconClass("/admin/dashboard")}`}></i>{" "}
                                    Dashboard
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/products")} to="/admin/products">
                                    <i className={`fas fa-shopping-bag mr-2 text-sm ${getIconClass("/admin/products")}`}></i>{" "}
                                    Products
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/settings")} to="/admin/settings">
                                    <i className={`fas fa-tools mr-2 text-sm ${getIconClass("/admin/settings")}`}></i>{" "}
                                    Settings
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/theaters")} to="/admin/theaters">
                                    <i className={`fas fa-table mr-2 text-sm ${getIconClass("/admin/theaters")}`}></i>{" "}
                                    Theaters
                                </Link>
                            </li>


                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/rooms")} to="/admin/rooms">
                                    <i className={`fas fa-table mr-2 text-sm ${getIconClass("/admin/rooms")}`}></i>{" "}
                                    Theater Rooms
                                </Link>
                            </li>
                            
                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/seattypes")} to="/admin/seattypes">
                                    <i className={`fas fa-users mr-2 text-sm ${getIconClass("/admin/seattypes")}`}></i>{" "}
                                    Seat Types
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/movies")} to="/admin/movies">
                                    <i className={`fas fa-users mr-2 text-sm ${getIconClass("/admin/movies")}`}></i>{" "}
                                    Movies
                                </Link>
                            </li>


                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/products")} to="/admin/products">
                                    <i className={`fas fa-users mr-2 text-sm ${getIconClass("/admin/products")}`}></i>{" "}
                                    Products
                                </Link>
                            </li>
                        </ul>

                        <hr className="my-4 md:min-w-full" />
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            eCommerce
                        </h6>
                        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/customers")} to="/admin/customers">
                                    <i className={`fas fa-user-friends mr-2 text-sm ${getIconClass("/admin/customers")}`}></i>{" "}
                                    Customers
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/orders")} to="/admin/orders">
                                    <i className={`fas fa-clipboard-list mr-2 text-sm ${getIconClass("/admin/orders")}`}></i>{" "}
                                    Orders
                                </Link>
                            </li>
                        </ul>

                        <hr className="my-4 md:min-w-full" />
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            Auth Layout Pages
                        </h6>

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                            <li className="items-center">
                                <Link className={getNavLinkClass("/auth/login")} to="/auth/login">
                                    <i className={`fas fa-fingerprint mr-2 text-sm ${getIconClass("/auth/login")}`}></i>{" "}
                                    Login
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className={getNavLinkClass("/auth/register")} to="/auth/register">
                                    <i className={`fas fa-clipboard-list mr-2 text-sm ${getIconClass("/auth/register")}`}></i>{" "}
                                    Register
                                </Link>
                            </li>
                        </ul>

                        <hr className="my-4 md:min-w-full" />
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            No Layout Pages
                        </h6>

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                            <li className="items-center">
                                <Link
                                    className={getNavLinkClass("/landing")}
                                    to="/landing"
                                >
                                    <i className={`fas fa-newspaper mr-2 text-sm ${getIconClass("/landing")}`}></i>{" "}
                                    Landing Page
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className={getNavLinkClass("/profile")}
                                    to="/profile"
                                >
                                    <i className={`fas fa-user-circle mr-2 text-sm ${getIconClass("/profile")}`}></i>{" "}
                                    Profile Page
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationDropdown from "../Dropdowns/NotificationDropdown";
import UserDropdown from "../Dropdowns/UserDropdown";
import "../BackendCSS/Backend.css"
//import UserDropdown from "";

const Sidebar: React.FC = () => {
    const [collapseShow, setCollapseShow] = useState<string>("hidden");

    const handleToggle = (value: string) => {
        setCollapseShow(value);
    };

    const getNavLinkClass = (path: string): string => {
        return "text-xs uppercase py-3 font-bold block " +
            (window.location.href.indexOf(path) !== -1
                ? "text-lightBlue-500 hover:text-lightBlue-600"
                : "text-blueGray-700 hover:text-blueGray-500");
    };

    const getIconClass = (path: string): string => {
        return (window.location.href.indexOf(path) !== -1
            ? "opacity-75"
            : "text-blueGray-300");
    };

    return (
        <>
            <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
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
                        Outside Inside
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
                                        Notus React
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
                                <Link className={getNavLinkClass("/admin/settings")} to="/admin/settings">
                                    <i className={`fas fa-tools mr-2 text-sm ${getIconClass("/admin/settings")}`}></i>{" "}
                                    Settings
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/tables")} to="/admin/tables">
                                    <i className={`fas fa-table mr-2 text-sm ${getIconClass("/admin/tables")}`}></i>{" "}
                                    Tables
                                </Link>
                            </li>
                            <li className="items-center">
                                <Link className={getNavLinkClass("/admin/users")} to="/admin/users">
                                    <i className={`fas fa-table mr-2 text-sm ${getIconClass("/admin/users")}`}></i>{" "}
                                    Users
                                </Link>
                            </li>

                            {/*<li className="items-center">*/}
                            {/*    <Link className={getNavLinkClass("/admin/maps")} to="/admin/maps">*/}
                            {/*        <i className={`fas fa-map-marked mr-2 text-sm ${getIconClass("/admin/maps")}`}></i>{" "}*/}
                            {/*        Maps*/}
                            {/*    </Link>*/}
                            {/*</li>*/}
                        </ul>

                        <hr className="my-4 md:min-w-full" />
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            eCommerce
                        </h6>
                        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                            <li className="items-center">
                                <Link className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block" to="/auth/login">
                                    <i className="fas fa-fingerprint text-blueGray-400 mr-2 text-sm"></i>{" "}
                                    Customers
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block" to="/admin/Orders">
                                    <i className="fas fa-clipboard-list text-blueGray-300 mr-2 text-sm"></i>{" "}
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
                                <Link className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block" to="/auth/login">
                                    <i className="fas fa-fingerprint text-blueGray-400 mr-2 text-sm"></i>{" "}
                                    Login
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block" to="/auth/register">
                                    <i className="fas fa-clipboard-list text-blueGray-300 mr-2 text-sm"></i>{" "}
                                    Register
                                </Link>
                            </li>
                        </ul>

                        {/* Divider */}
                        <hr className="my-4 md:min-w-full" />
                        {/* Heading */}
                        <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
                            No Layout Pages
                        </h6>
                        {/* Navigation */}

                        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                            <li className="items-center">
                                <Link
                                    className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                                    to="/landing"
                                >
                                    <i className="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>{" "}
                                    Landing Page
                                </Link>
                            </li>

                            <li className="items-center">
                                <Link
                                    className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                                    to="/profile"
                                >
                                    <i className="fas fa-user-circle text-blueGray-400 mr-2 text-sm"></i>{" "}
                                    Profile Page
                                </Link>
                            </li>
                        </ul>

                        {/*<hr className="my-4 md:min-w-full" />*/}
                        {/*<h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">*/}
                        {/*    Documentation*/}
                        {/*</h6>*/}

                        {/*<ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">*/}
                        {/*    {[*/}
                        {/*        { href: "colors", icon: "paint-brush", text: "Styles" },*/}
                        {/*        { href: "alerts", icon: "css3-alt", text: "CSS Components", iconPrefix: "fab" },*/}
                        {/*        { href: "angular", icon: "angular", text: "Angular", iconPrefix: "fab" },*/}
                        {/*        { href: "js", icon: "js-square", text: "Javascript", iconPrefix: "fab" },*/}
                        {/*        { href: "nextjs", icon: "react", text: "NextJS", iconPrefix: "fab" },*/}
                        {/*        { href: "react", icon: "react", text: "React", iconPrefix: "fab" },*/}
                        {/*        { href: "svelte", icon: "link", text: "Svelte" },*/}
                        {/*        { href: "vue", icon: "vuejs", text: "VueJS", iconPrefix: "fab" }*/}
                        {/*    ].map((item) => (*/}
                        {/*        <li key={item.href} className="inline-flex">*/}
                        {/*            <a*/}
                        {/*                href={`https://www.creative-tim.com/learning-lab/tailwind/${item.href}/overview/notus`}*/}
                        {/*                target="_blank"*/}
                        {/*                rel="noopener noreferrer"*/}
                        {/*                className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold"*/}
                        {/*            >*/}
                        {/*                <i className={`${item.iconPrefix || 'fas'} fa-${item.icon} mr-2 text-blueGray-300 text-base`}></i>*/}
                        {/*                {item.text}*/}
                        {/*            </a>*/}
                        {/*        </li>*/}
                        {/*    ))}*/}
                        {/*</ul>*/}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
import React, { useRef, useState } from "react";
import { createPopper } from "@popperjs/core";

const UserDropdown: React.FC = () => {
    const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
    const btnDropdownRef = useRef<HTMLAnchorElement>(null);
    const popoverDropdownRef = useRef<HTMLDivElement>(null);

    const openDropdownPopover = () => {
        if (btnDropdownRef.current && popoverDropdownRef.current) {
            createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
                placement: "bottom-start",
                strategy: 'fixed',

            });
        }
        setDropdownPopoverShow(true);
    };

    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (dropdownPopoverShow) {
            closeDropdownPopover();
        } else {
            openDropdownPopover();
        }
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
    };

    return (
        <>
            <a
                className="text-blueGray-500 block"
                href="#pablo"
                ref={btnDropdownRef}
                onClick={handleClick}
            >
                <div className="items-center flex">
                    <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                        <img
                            alt="..."
                            className="w-full rounded-full align-middle border-none shadow-lg"
                            src={("../src/assets/img/team-1-800x800.jpg")}
                        />
                    </span>
                </div>
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
                }
            >
                <a
                    href="#pablo"
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    onClick={handleLinkClick}
                >
                    Action
                </a>
                <a
                    href="#pablo"
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    onClick={handleLinkClick}
                >
                    Another action
                </a>
                <a
                    href="#pablo"
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    onClick={handleLinkClick}
                >
                    Something else here
                </a>
                <div className="h-0 my-2 border border-solid border-blueGray-100" />
                <a
                    href="#pablo"
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    onClick={handleLinkClick}
                >
                    Seprated link
                </a>
            </div>
        </>
    );
};

export default UserDropdown;
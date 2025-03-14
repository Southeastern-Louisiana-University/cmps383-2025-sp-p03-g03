import React from "react";
import { Outlet } from "react-router-dom";
import "../BackendCSS/Backend.css"

// components
import AdminNavbar from "../Navbars/AdminNavbar";
import Sidebar from "../Sidebar/Sidebar";
import HeaderStats from "../Headers/HeaderStats";
import FooterAdmin from "../Footers/FooterAdmin";

const Admin: React.FC = () => {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-summit">
                <AdminNavbar />
                <HeaderStats />
                
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    {/* This is where child routes will render */}
                    
                    <Outlet />
                    
                    <FooterAdmin /> 
                </div>
            </div>
        </>
    );
};

export default Admin;
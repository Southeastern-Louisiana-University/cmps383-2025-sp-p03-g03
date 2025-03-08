import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// components
import AdminNavbar from "../Navbars/AdminNavbar";
import Sidebar from "../Sidebar/Sidebar";
import HeaderStats from "../Headers/HeaderStats";
import FooterAdmin from "../Footers/FooterAdmin";

// views
import Dashboard from "../Views/Admin/Dashboard";
//import Maps from "../views/admin/Maps";
import Settings from "../Views/Admin/Settings";
import Tables from "../Views/Admin/Tables";
import Users from "../Views/Admin/Users";

//import Orders from "../../../FrontendClient/Components/Views/eCommerce/Orders"
//import Customers from "../../../FrontendClient/Components/Views/eCommerce/Customers"

import Orders from "../../Components/Views/Admin/Orders"
//import Customers from "../../../FrontendClient/Components/Views/eCommerce/Customers"

const Admin: React.FC = () => {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-summit">
                <AdminNavbar />
                <HeaderStats />
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/*<Route path="/maps" element={<Maps />} />*/}
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/tables" element={<Tables />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="/orders" element={<Orders />} />
                        {/*<Route path="/Customers" element={<Customers />} />*/}

                    </Routes>
                    <FooterAdmin />
                </div>
            </div>
        </>
    );
};

export default Admin;
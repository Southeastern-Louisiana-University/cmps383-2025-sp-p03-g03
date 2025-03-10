//import "./index.css";
import App from "./routes/App.tsx";
import Movies from "./routes/Movies.tsx";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import TopBar from "./components/topbar";
import Admin from "./BackendClient/Components/Layouts/Admin.tsx";
import Dashboard from "./BackendClient/Components/Views/Admin/Dashboard.tsx";
import Orders from "./BackendClient/Components/Views/Admin/Orders.tsx";

// Layout component that includes the TopBar and Outlet
const Layout = () => {
  return (
    <>
      <TopBar />
      <Outlet /> {/* This renders the matched route */}
    </>
  );
};

// Layout component that includes the TopBar and Outlet
// const AdminLayout = () => {
//   return (
//     <>
//       {/* <AdminNavbar />
//       <HeaderStats /> 
//       <Sidebar /> */}
//     </>
//   );
// };

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use the Layout component for all routes
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/movies",
        element: <Movies />,
    },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children:
    [
      {
      path: "/admin/dashboard",
      element: <Dashboard />
      },
      {
        path: "/admin/orders",
        element: <Orders />

      }
    ]
  }
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

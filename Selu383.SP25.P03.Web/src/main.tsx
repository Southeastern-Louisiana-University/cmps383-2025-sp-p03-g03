import "./index.css";
import App from "./routes/App.tsx";
import Movies from "./routes/Movies.tsx";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import TopBar from "./components/topbar";

// Layout component that includes the TopBar and Outlet
const Layout = () => {
  return (
    <>
      <TopBar />
      <Outlet /> {/* This renders the matched route */}
    </>
  );
};

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
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

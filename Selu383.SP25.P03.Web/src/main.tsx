import App from "./routes/App.tsx";
import Movies from "./routes/Movies.tsx";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import TopBar from "./components/topbar";
import Admin from "./BackendClient/Components/Layouts/Admin.tsx";
import Dashboard from "./BackendClient/Components/Views/Admin/Dashboard.tsx";
import Products from "./BackendClient/Components/Views/Admin/Products.tsx";
import MovieDetails from "./routes/MovieDetails.tsx";

// Layout component that includes the TopBar and Outlet
const Layout = () => {
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/movies/:id",
        element: <MovieDetails />,
      },
    ],
  },
  {
    path: "admin",
    element: <Admin />,
    children: [
      {
        index: true, // This is the default route
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
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

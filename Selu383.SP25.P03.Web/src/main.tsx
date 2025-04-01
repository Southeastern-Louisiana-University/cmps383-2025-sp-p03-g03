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
import { AuthProvider } from "./components/authContext.tsx";
import TheatreChoice from "./routes/TicketBuyingProcess/TheatreChoice.tsx";
import ShowtimeChoice from "./routes/TicketBuyingProcess/ShowtimeChoice.tsx";
import LoginPage from "./routes/LoginPage.tsx";
import MyTickets from "./components/MyTicketsPage.tsx";

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
        index: true,
        element: <App />,
      },
      {
        path: "movies",
        children: [
          {
            index: true,
            element: <Movies />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <MovieDetails />,
              },
              {
                path: "theaters", // Corrected path (relative)
                element: <TheatreChoice />,
              },
              {
                path: "showtimes", // Corrected path (relative)
                element: <ShowtimeChoice />,
              },
            ],
          },
        ],
      },
      {
        path: "/LoginPage",
        element: <LoginPage />,
      },
      {
        path: "/MyTickets",
        element: <MyTickets />,
      },
    ],
  },
  {
    path: "admin",
    element: <Admin />,
    children: [
      {
        index: true,
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
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
}

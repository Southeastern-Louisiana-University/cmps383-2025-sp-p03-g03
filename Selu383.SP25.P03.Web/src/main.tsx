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
import TheatreChoice from "./routes/TheatreChoice.tsx";
import LoginPage from "./routes/LoginPage.tsx";
import MyTickets from "./routes/MyTicketsPage.tsx";
// Import the theater, user, and room components
import TheaterListPage from "./BackendClient/Components/Theater/TheaterListPage.tsx";
import TheaterFormPage from "./BackendClient/Components/Theater/TheaterForm.tsx";
import RoomListPage from "./BackendClient/Components/Room/RoomListPage.tsx";
import RoomFormPage from "./BackendClient/Components/Room/RoomForm.tsx";
import SeatTypeListPage from "./BackendClient/Components/Seats/SeatTypeListPage.tsx";
import SeatTypeForm from "./BackendClient/Components/Seats/SeatTypeForm.tsx";
import ConcessionsPage from "./routes/ConcessionsPage.tsx";

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
            ],
          },
        ],
      },
      {
        path: "/theaters",
        element: <TheatreChoice />,
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
            // Admin routes for theater management
            {
                path: "theaters",
                children: [
                    {
                        index: true,
                        element: <TheaterListPage />,
                    },
                    {
                        path: "new",
                        element: <TheaterFormPage />,
                    },
                    {
                        path: ":id/edit",
                        element: <TheaterFormPage />,
                    },
                ],
            },
            // Admin routes for room management
            {
                path: "rooms",
                children: [
                    {
                        index: true,
                        element: <RoomListPage />,
                    },
                    {
                        path: "new",
                        element: <RoomFormPage />,
                    },
                    {
                        path: ":id/edit",
                        element: <RoomFormPage />,
                    },
                ],
            },
            // Admin routes for seat type management
            {
                path: "seat-types",
                children: [
                    {
                        index: true,
                        element: <SeatTypeListPage />,
                    },
                    {
                        path: "new",
                        element: <SeatTypeForm />,
                    },
                    {
                        path: ":id/edit",
                        element: <SeatTypeForm />,
                    },
                ],
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

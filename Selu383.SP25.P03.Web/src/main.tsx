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
import Checkout from "./routes/CheckoutPage.tsx";
import { AuthProvider } from "./components/authContext.tsx";
import TheatreChoice from "./routes/TheatreChoice.tsx";
import LoginPage from "./routes/LoginPage.tsx";
import MyTickets from "./routes/MyTicketsPage.tsx";
import SeatSelection from "./routes/SeatSelectionPage.tsx";
import TheaterListPage from "./BackendClient/Components/Theater/TheaterListPage.tsx";
import TheaterFormPage from "./BackendClient/Components/Theater/TheaterForm.tsx";
import RoomListPage from "./BackendClient/Components/Room/RoomListPage.tsx";
import RoomFormPage from "./BackendClient/Components/Room/RoomForm.tsx";
import SeatTypeListPage from "./BackendClient/Components/Seats/SeatTypeListPage.tsx";
import SeatTypeForm from "./BackendClient/Components/Seats/SeatTypeForm.tsx";
import MovieListPage from "./BackendClient/Components/Movies/MovieListPage.tsx";
import MovieForm from "./BackendClient/Components/Movies/MovieForm.tsx";
import ProductListPage from "./BackendClient/Components/Products/ProductListPage.tsx";
import ProductForm from "./BackendClient/Components/Products/ProductForm.tsx";
import MovieScheduleListPage from "./BackendClient/Components/MovieSchedule/MovieScheduleListPage.tsx";
import MovieScheduleForm from "./BackendClient/Components/MovieSchedule/MovieScheduleForm.tsx";
import MovieScheduleAssignments from "./BackendClient/Components/MovieSchedule/MovieScheduleAssignments.tsx";
import UserListPage from "./BackendClient/Components/Users/UserListPage.tsx";
import UserForm from "./BackendClient/Components/Users/UserForm.tsx";


import ConcessionsPage from "./routes/ConcessionsPage.tsx";
import About from "./routes/About.tsx";
import Terms from "./routes/Terms.tsx";
import Privacy from "./routes/Privacy.tsx";
import ContactPage from "./routes/Contact.tsx";
import ProfilePage from "./routes/ProfilePage.tsx";
import SignupPage from "./routes/SignupPage.tsx";
import CheckoutSuccess from "./routes/CheckoutSuccess.tsx";

const Layout = () => {
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
};

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">
          404 - Page Not Found
        </h1>
        <p className="text-gray-300 mt-4">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/movies"
          className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Go to Movies
        </a>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
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
            path: ":movieId",
            element: <MovieDetails />,
          },
          {
            path: ":movieId/seats/:theaterId/:roomId/:scheduleId",
            element: <SeatSelection />,
          },
        ],
      },
      {
        path: "theaters",
        element: <TheatreChoice />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "/checkout/success",
        element: <CheckoutSuccess />,
      },
      {
        path: "LoginPage",
        element: <LoginPage />,
      },
      {
        path: "MyTickets",
        element: <MyTickets />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "Concessions",
        element: <ConcessionsPage />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },
  {
    path: "admin",
    element: <Admin />,
    errorElement: <ErrorPage />,
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
            path: ":id",
            element: <TheaterFormPage />,
          },
        ],
        }, 
        {
            path: "users",
            children: [
                {
                    index: true,
                    element: <UserListPage />,
                },
                {
                    path: "new",
                    element: <UserForm />,
                },
                {
                    path: ":id",
                    element: <UserForm />,
                },
            ],
        },
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
            path: ":id",
            element: <RoomFormPage />,
          },
        ],
      },
      {
        path: "movies",
        children: [
          {
            index: true,
            element: <MovieListPage />,
          },
          {
            path: "new",
            element: <MovieForm />,
          },
          {
            path: ":id",
            element: <MovieForm />,
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <ProductListPage />,
          },
          {
            path: ":id",
            element: <ProductForm />,
          },
          {
            path: "new",
            element: <ProductForm />,
          },
        ],
      },
      {
        path: "seattypes",
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
            path: ":id",
            element: <SeatTypeForm />,
          },
        ],
      },
      {
        path: "movieschedules",
        children: [
          {
            index: true,
            element: <MovieScheduleListPage />,
          },
          {
            path: ":id",
            element: <MovieScheduleForm />,
          },
          {
            path: ":id/assignments",
            element: <MovieScheduleAssignments />,
          },
          {
            path: "new",
            element: <MovieScheduleForm />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
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

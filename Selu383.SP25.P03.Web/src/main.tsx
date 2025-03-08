import "./index.css";
import App from "./routes/App.tsx";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TopBar from "./components/topbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TopBar />
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

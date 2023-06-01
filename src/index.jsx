import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Subjects from "./components/subject/Subjects.jsx";
import {getToken} from './utils/token.js';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Subjects />,
        path: "/subjects",
        loader: async () => {
          console.log("loader");
          const response = await fetch(
            `http://localhost:8080/api/v1/subjects`,
            {
              method: "GET",
              headers: {
                Authorization: getToken(),
              },
            }
          );
          const subjects = await response.json();
          return subjects;
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

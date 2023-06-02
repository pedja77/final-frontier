import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Subjects from "./components/subject/Subjects.jsx";
import { getToken } from "./utils/token.js";
import Subject from "./components/subject/Subject.jsx";

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
          const token = getToken();
          const response = await fetch(
            `http://localhost:8080/api/v1/subjects`,
            {
              method: "GET",
              headers: {
                Authorization: token,
              },
            }
          );
          const subjects = await response.json();
          const response2 = await fetch(`http://localhost:8080/api/v1/grades`, {
            method: "GET",
            headers: {
              Authorization: token,
            },
          });
          const grades = await response2.json();

          return [subjects, grades];
        },
      },
      {
        element: <Subject />,
        path: "subjects/:id",
        loader: async ({ params }) => {
          const response = await fetch(
            `http://localhost:8080/api/v1/subjects/${params.id}`,
            {
              method: "GET",
              headers: {
                Authorization: getToken(),
              },
            }
          );
          const subject = await response.json();
          return subject;
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

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Subjects from "./components/subject/Subjects.jsx";
import { checkLogin, getToken } from "./utils/token.js";
import Subject from "./components/subject/Subject.jsx";
import Error from "./components/Error.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        element: <Subjects />,
        path: "/subjects",
        loader: async () => {
          console.log("loader");
          const user = checkLogin(["ROLE_ADMIN", "ROLE_STUDENT"])
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
        children: [
          {
            path: "/subjects/search",
            loader:  ({request}) => {
              console.log('params ' + (new URL(request.url)).searchParams)
              const search = (new URL(request.url)).searchParams;
              // if((new URL(request.url)).searchParams.get("query") !== null){
              //   console.log("GET operacija koja radi pretragu.");
              //   return null; 
              // }else{
              //   return fetch(`http://localhost:8080/api/v1/genre/${params.id}`);  
              // }
              const res =  fetch(`http://localhost:8080/api/v1/subjects/search?${search}`, {
                method: 'GET',
                headers: {
                  Authorization: getToken()
                }
              });
              // const data = await res.json();
              // console.log('data ' + JSON.stringify(data));
              return res;
            },
          },
        ]
      },
      {
        element: <Subject />,
        path: "subjects/:id",
        loader: async ({ params }) => {
          console.log('params ' + JSON.stringify(params))
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

          const response2 = await fetch(`http://localhost:8080/api/v1/grades`, {
            method: "GET",
            headers: {
              Authorization: getToken(),
            },
          });
          const grades = await response2.json();

          const response3 = await fetch(`http://localhost:8080/api/v1/teachers`, {
            method: 'GET',
            headers: {
              Authorization: getToken()
            },
          });
          const teachers = await response3.json();
          
          const response4 = await fetch(`http://localhost:8080/api/v1/students?grade=${subject.grade}`, {
            method: 'GET',
            headers: {
              Authorization: getToken()
            }
          });
          
          const students = await response4.json();
          console.log('students by grade ' + JSON.stringify(students, null, 4));
          return [subject, grades, teachers, students];
        },
        action: async ({params, request}) => {
          const data = Object.fromEntries(await request.formData());
          data.teachers = JSON.parse(data.teachers);
          data.students = JSON.parse(data.students);
          // console.log('request ' + JSON.stringify(data))
          // console.log('params ' + JSON.stringify(params))
          const res = await fetch(`http://localhost:8080/api/v1/subjects/${params.id}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: getToken()
            },
            body: JSON.stringify(data)
          })
          return res;
        }
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

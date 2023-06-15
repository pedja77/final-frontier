import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Subjects from "./components/subject/Subjects.jsx";
import { checkRole, getToken } from "./utils/token.js";
import Subject from "./components/subject/Subject.jsx";
import Error from "./components/Error.jsx";
import { checkResponse } from "./utils/responseChecker.js";
import NewSubject from "./components/subject/NewSubject.jsx";
import Teachers from "./components/teacher/Teachers.jsx";
import Teacher from "./components/teacher/Teacher.jsx";
import NewTeacher from "./components/teacher/NewTeacher.jsx";
import {
  deleteResource,
  getResource,
  postResource,
  putResource,
} from "./utils/paths.js";

const baseUrl = "http://localhost:8080/api/v1";

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
          checkRole([
            "ROLE_ADMIN",
            "ROLE_STUDENT",
            "ROLE_TEACHER",
          ]);
          
          const response = await getResource(`http://localhost:8080/api/v1/subjects`);
          checkResponse(response);
          const subjects = await response.json();

          const response2 = await getResource(`http://localhost:8080/api/v1/grades`);
          checkResponse(response2);
          const grades = await response2.json();

          return [subjects, grades];
        },
      },
      {
        element: <Subject />,
        path: "subjects/:id",
        loader: async ({ params }) => {
          checkRole([
            "ROLE_ADMIN",
            "ROLE_STUDENT",
            "ROLE_TEACHER",
          ]);
          
          const response = await getResource(`http://localhost:8080/api/v1/subjects/${params.id}`);
          checkResponse(response);
          const subject = await response.json();

          const response2 = await getResource(`http://localhost:8080/api/v1/grades`);
          checkResponse(response2);
          const grades = await response2.json();

          const response3 = await getResource(`http://localhost:8080/api/v1/teachers`);
          checkResponse(response3);
          const teachers = await response3.json();

          const response4 = await getResource(`http://localhost:8080/api/v1/students/grade/${subject.grade}`);
          checkResponse(response4);
          const students = await response4.json();

          return [subject, grades, teachers, students];
        },
        action: async ({ params, request }) => {
          if (request.method === "PUT") {
            console.log("put subject action params.id " + params.id);
            const data = Object.fromEntries(await request.formData());
            data.teachers = JSON.parse(data.teachers);
            data.students = JSON.parse(data.students);
            // const res = await fetch(
            //   `http://localhost:8080/api/v1/subjects/${params.id}`,
            //   {
            //     method: "PUT",
            //     headers: {
            //       "Content-Type": "application/json",
            //       Authorization: getToken(),
            //     },
            //     body: JSON.stringify(data),
            //   }
            // );
            const res = await putResource(`http://localhost:8080/api/v1/subjects/${params.id}`, data);
            checkResponse(res);
            return res;
          } else if (request.method === "DELETE") {
            console.log("delete subject action params.id " + params.id);
            // const res = await fetch(
            //   `http://localhost:8080/api/v1/subjects/${params.id}`,
            //   {
            //     method: "DELETE",
            //     headers: {
            //       "Content-Type": "application/json",
            //       Authorization: getToken(),
            //     },
            //   }
            // );
            const res = await deleteResource(`http://localhost:8080/api/v1/subjects/${params.id}`)
            checkResponse(res);
            return res;
          }
        },
      },
      {
        path: "/subjects/new",
        element: <NewSubject />,
        loader: async ({ params }) => {
          checkRole(["ROLE_ADMIN"]);
          // const response2 = await fetch(`http://localhost:8080/api/v1/grades`, {
          //   method: "GET",
          //   headers: {
          //     Authorization: getToken(),
          //   },
          // });
          const response2 = await getResource(`http://localhost:8080/api/v1/grades`);
          checkResponse(response2);
          const grades = await response2.json();

          // const response3 = await fetch(
          //   `http://localhost:8080/api/v1/teachers`,
          //   {
          //     method: "GET",
          //     headers: {
          //       Authorization: getToken(),
          //     },
          //   }
          // );
          const response3 = await getResource(`http://localhost:8080/api/v1/teachers`);
          checkResponse(response3);
          const teachers = await response3.json();
            
          return [grades, teachers];
        },
        action: async ({ params, request }) => {
          checkRole(["ROLE_ADMIN"]);
          const data = Object.fromEntries(await request.formData());
          data.teachers = JSON.parse(data.teachers);
          data.students = JSON.parse(data.students);

          // const res = await fetch(`http://localhost:8080/api/v1/subjects`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //     Authorization: getToken(),
          //   },
          //   body: JSON.stringify(data),
          // });
          const res = await postResource(`http://localhost:8080/api/v1/subjects`, data);
          checkResponse(res);
          return res;
        },
      },
      {
        path: "/teachers",
        element: <Teachers />,
        loader: async () => {
          checkRole([
            "ROLE_ADMIN",
            "ROLE_STUDENT",
            "ROLE_TEACHER",
          ]);
          // const response = await fetch(
          //   "http://localhost:8080/api/v1/teachers",
          //   {
          //     method: "GET",
          //     headers: {
          //       Authorization: getToken(),
          //     },
          //   }
          // );
          const response = await getResource("http://localhost:8080/api/v1/teachers");
          checkResponse(response);
          const teachers = await response.json();

          return teachers;
        },
      },
      {
        path: "/teachers/:id",
        element: <Teacher />,
        loader: async ({ params }) => {
          checkRole([
            "ROLE_ADMIN",
            "ROLE_STUDENT",
            "ROLE_TEACHER",
          ]);
          const response = await getResource(
            `${baseUrl}/teachers/${params.id}`
          );
          checkResponse(response);
          const teacher = await response.json();
      
          const response2 = await getResource(
            `${baseUrl}/subjects/teacher/${params.id}`
          );
          checkResponse(response2);
          const subsByTeacher = await response2.json();

          // const response3 = await getResource(baseUrl + `/students/teacher/${params.id}`);
          // checkResponse(response3);
          // const studentsByTeacher = await response3.json();
          // console.log(`students by teacher ${params.id} ${JSON.stringify(studentsByTeacher, null, 4)}`);

          const response4 = await getResource(baseUrl + `/subjects`);
          checkResponse(response4);
          const subjects = await response4.json();

          // const response5 = await getResource(baseUrl + "/students");
          // checkResponse(response5);
          // const students = await response5.json();

          return [teacher, subsByTeacher, subjects];
        },
        action: async ({ params, request }) => {
          checkRole(["ROLE_ADMIN"]);
          if (request.method === "PUT") {
            const data = Object.fromEntries(await request.formData());
            data.subjects = JSON.parse(data.subjects);
            // data.students = JSON.parse(data.students);
            const res = await putResource(
              baseUrl + `/teachers/${params.id}`,
              data
            );
            checkResponse(res);
            return res;
          } else if (request.method === "DELETE") {
            console.log("delete teacher " + params.id);
            const res = await deleteResource(baseUrl + `/users/${params.id}`);
            console.log("delete response " + res);
            // checkResponse(res);
            return res;
          }
        },
      },
      {
        path: "/teachers/new",
        element: <NewTeacher />,
        loader: async () => {
          checkRole(["ROLE_ADMIN"]);
          const response = await getResource(baseUrl + "/subjects");
          checkResponse(response);
          const subjects = await response.json();

          const response2 = await getResource(baseUrl + '/users');
          checkResponse(response2);
          const users = (await response2.json());

          return [subjects, users];
        },
        action: async ({ params, request }) => {
          checkRole(["ROLE_ADMIN"]);
          const data = Object.fromEntries(await request.formData());
          data.subjects = JSON.parse(data.subjects);
          const response = await postResource(baseUrl + "/users", data);
          checkResponse(response);

          return response;
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

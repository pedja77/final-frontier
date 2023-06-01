import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Subjects from './components/subject/Subjects.jsx';

const getUser = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('getUser ' + user);
  return user;
}

const getToken = () => {
  return `Bearer ${getUser().token}`;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Subjects />,
        path: '/subjects',
        loader: async () => {
          const response = await fetch(`http://localhost:8080/api/v1/subjects`, {
            method: 'GET',
            headers: {
              Authorization: getToken()
            }
          });
          const subjects = await response.json();
          return subjects;
        }
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

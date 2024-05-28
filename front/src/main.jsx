import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Welcome from './pages/Welcome/Welcome';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Etablissements from './pages/Etablissements/Etablissements';
import Etablissement from './pages/Etablissement/Etablissement';
import Menu from './pages/Menu/Menu';
import Success from './pages/Success/Success';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/etablissements",
    element: <Etablissements />
  },
  {
    path: "/admin/etablissement/:id",
    element: <Etablissement />
  },
  {
    path:"/menu/:id",
    element: <Menu />
  },
  {
    path: "/success",
    element: <Success />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </React.StrictMode>,
)

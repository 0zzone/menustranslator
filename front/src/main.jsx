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
import Admin from './pages/Admin/Admin';
import Mobile from './pages/Mobile/Mobile';
import NotFound from './pages/NotFound/NotFound';
import Demo from './pages/Demo/Demo';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/demo",
    element: <Demo />
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
    path: "/success/:id_user/:price_id",
    element: <Success />
  },
  {
    path: "/admin/admin",
    element: <Admin />
  },
  {
    path: "/mobile",
    element: <Mobile />
  },
  {
    path: "/notFound",
    element: <NotFound />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </React.StrictMode>,
)

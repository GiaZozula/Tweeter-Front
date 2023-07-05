import {createBrowserRouter, RouterProvider, Outlet} from "react-router-dom";
import './App.css';
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Explore from "./pages/Explore/Explore";
import Signin from "./pages/Signin/Signin";
import Navbar from "./components/Navbar/Navbar";
import Error from "./pages/Error/Error";

const Layout = () => {
  return (
    <div className="md:w-8/12 mx-auto">
      <Navbar />
      {/* Outlet is basically every page, this places Navbar always above */}
      <Outlet></Outlet>
    </div>
  );
};

// Routes for all of the pages
const router = createBrowserRouter([
  {
    //hits the intial page, goes to children
    path: "/",
    errorElement: <Error />,
    element: <Layout />,
    children: [
      {
        //and then takes us to this path, which in turn displays the Home page element
        path: "/",
        element: <Home />,
      },
      {
        //takes the id from the backend, brings in that info, and displays it as part of the Profile page
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signout",
        element: <Signin />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;

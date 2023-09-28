import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login/login";
import Register from "./pages/register/register";
import Home from "./pages/home/home";
import HomeLayout from "./pages/allLayouts/homeLayout/homeLayout";
import Markets from "./pages/markets/markets";
import SpotDetails from "./pages/spotDetails/marketDetail";
import FuturesDetail from "./pages/futuresDetails/futuresDetails";
import AccountDetail from "./pages/accountDetail/accoutDetail";
import Page404 from "./pages/404/404";
import ProtectedRoute from "./protectedRoutes";
import AccountApproval from "./pages/AccountApproval/accountApproval";

export const allRoutes = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    children: [
      {
        path: "",
        element: <Home></Home>,
      },
      {
        path: "/accountApproval/:key",
        element: <AccountApproval></AccountApproval>,
      },
      {
        path: "/accountDetail",
        element: (
          <ProtectedRoute>
            <AccountDetail></AccountDetail>
          </ProtectedRoute>
        ),
      },

      {
        path: "/markets",
        element: <Markets></Markets>,
      },

      {
        path: "/markets/spot/:symbol",
        element: <SpotDetails></SpotDetails>,
      },

      {
        path: "/markets/futures/:symbol",
        element: <FuturesDetail></FuturesDetail>,
      },
    ],
  },

  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "*",
    element: <Page404></Page404>,
  },
]);

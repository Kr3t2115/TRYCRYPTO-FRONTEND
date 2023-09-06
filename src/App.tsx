import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/login/login";
import Register from "./pages/register/register";
import Home from "./pages/home/home";
import HomeLayout from "./pages/allLayouts/homeLayout/homeLayout";
import Markets from "./pages/markets/markets";
import SpotDetails from "./pages/spotDetails/marketDetail";
import FuturesDetail from "./pages/futuresDetails/futuresDetails";
import AccountDetail from "./pages/accountDetail/accoutDetail";
import Page404 from "./pages/404/404";
import { Suspense, useEffect, useState } from "react";
import { AuthContext } from "./context/authContext";
import axios from "axios";
import ProtectedRoute from "./protectedRoutes";
import Loader from "./components/loader/loader";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
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

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        Strona_glowna: "Home",
      },
    },
    pl: {
      translation: {
        Strona_glowna: "Strona główna",
      },
    },
    de: {
      translation: {
        Strona_glowna: "Hauptseite",
      },
    },
  },
  lng: "pl",
});

function App() {
  const [logged, setLogged] = useState<true | false>(false);

  const [currentBalance, setCurrentBalance] = useState<Object>(
    JSON.stringify({})
  );

  const { t, i18n } = useTranslation();

  const [userInfo, setUserInfo] = useState<Object>(JSON.stringify({}));

  useEffect(() => {
    if (logged === true) {
      setInterval(() => {
        axios
          .get("https://api.trycrypto.pl/user/refresh/token", {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => console.log(res));
      }, 240000);
    }
  }, [logged]);

  return (
    <AuthContext.Provider
      value={{
        auth: logged,
        setAuth: setLogged,
        setCurrentBalance: setCurrentBalance,
        currentBalance: currentBalance,
        userInfo: userInfo,
        setUserInfo: setUserInfo,
      }}
    >
      <Suspense fallback={<Loader isOpen={true}></Loader>}>
        <RouterProvider router={allRoutes} />
      </Suspense>
    </AuthContext.Provider>
  );
}

export default App;

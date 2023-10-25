import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Suspense, useEffect, useState } from "react";
import { AuthContext } from "./context/authContext";
import Loader from "./components/loader/loader";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Layout from "./Layout";
import { allRoutes } from "./routes";
import refreshToken from "./services/refreshToken";
import { translation } from "./i18";

i18n.use(initReactI18next).init({
  resources: translation,
  lng: "pl",
});

function App() {
  const [auth, setAuth] = useState<boolean>(false);

  const [currentBalance, setCurrentBalance] = useState<string>(
    JSON.stringify({})
  );

  const [userInfo, setUserInfo] = useState<Object>(JSON.stringify({}));

  useEffect(() => {
    if (auth === true) {
      setInterval(() => {
        refreshToken();
      }, 240000);
    }
  }, [auth]);

  useEffect(() => {
    console.log(currentBalance);
  }, [currentBalance]);

  return (
    <AuthContext.Provider
      value={{
        auth: auth,
        setAuth: setAuth,
        setCurrentBalance: setCurrentBalance,
        currentBalance: currentBalance,
        userInfo: userInfo,
        setUserInfo: setUserInfo,
      }}
    >
      <Suspense fallback={<Loader isOpen={true}></Loader>}>
        <Layout>
          <RouterProvider router={allRoutes} />
        </Layout>
      </Suspense>
    </AuthContext.Provider>
  );
}

export default App;

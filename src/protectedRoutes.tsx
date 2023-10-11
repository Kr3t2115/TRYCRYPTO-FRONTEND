import { useContext, useEffect } from "react";
import { AuthContext } from "./context/authContext";
import { PageContext } from "./context/pageContext";
import { useNavigate } from "react-router-dom";
import { Error as ErrorInterface } from "./interfaces/Error";
import { useTranslation } from "react-i18next";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth }: { auth: boolean } = useContext(AuthContext);
  const { setError }: { setError: (e: ErrorInterface) => void } =
    useContext(PageContext);

  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/");
      setError({ message: t("Zaloguj się aby konynuować"), status: true });
    }
  }, [auth]);

  return <>{children}</>;
}

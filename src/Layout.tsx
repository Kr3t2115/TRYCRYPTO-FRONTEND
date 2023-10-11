import React, { useEffect, useState } from "react";
import Loader from "./components/loader/loader";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Error as ErrorInterface } from "./interfaces/Error";
import { Loading } from "./interfaces/Loading";
import { useTranslation } from "react-i18next";
import { PageContext } from "./context/pageContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorInterface>({
    status: false,
    message: "",
  });

  const [loading, setLoading] = useState<Loading>({ status: false });

  const handleClose = () => setError({ message: "", status: false });

  const { t } = useTranslation();

  return (
    <>
      <PageContext.Provider
        value={{
          error: error,
          setError: setError,
          loading: loading,
          setLoading: setLoading,
        }}
      >
        {loading?.status ? <Loader isOpen={loading.status}></Loader> : ""}

        {error?.status ? (
          <>
            <Modal show={error.status} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{t("Błąd")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{error.message}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  {t("Zamknij")}
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          ""
        )}

        {children}
      </PageContext.Provider>
    </>
  );
}

import { useParams } from "react-router-dom";
import classess from "./accountApproval.module.css";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import confirmToken from "../../services/confirmToken";

export default function AccountApproval() {
  let { key } = useParams();

  const { t } = useTranslation();

  const inputNubmer = useRef<null | HTMLInputElement>(null);

  const handleCode = () => {
    confirmToken(key, inputNubmer.current?.value);
  };

  useEffect(() => {});

  return (
    <div className={classess.mainCont}>
      <div className={classess.formCont}>
        <label>{t("Wpisz tutaj kod z maila")}</label>
        <input className={classess.input} ref={inputNubmer} type="text"></input>
        <button className={classess.submit} type="button" onClick={handleCode}>
          {t("Wyślij kod")}
        </button>
      </div>
    </div>
  );
}

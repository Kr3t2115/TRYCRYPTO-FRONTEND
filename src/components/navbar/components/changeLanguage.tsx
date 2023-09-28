import Class from "./changeLanguage.module.css";
import { useTranslation } from "react-i18next";

export default function ChangeLanguage({ setter }: any) {
  const { t } = useTranslation();

  return (
    <>
      <select
        className={Class.changeLanguageBox}
        onChange={(e) => setter(e.target.value)}
      >
        <option value="pl">🇵🇱 {t("Polski")}</option>
        <option value="en">🇬🇧 {t("Angielski")}</option>
      </select>
    </>
  );
}

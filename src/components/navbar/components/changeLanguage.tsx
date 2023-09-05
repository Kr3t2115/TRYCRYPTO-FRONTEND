import Class from "./changeLanguage.module.css";

export default function ChangeLanguage({ setter }: any) {
  return (
    <>
      <select
        className={Class.changeLanguageBox}
        onChange={(e) => setter(e.target.value)}
      >
        <option value="pl">🇵🇱 Polski</option>
        <option value="en">🇬🇧 English</option>
        <option value="de">🇩🇪 Deutsche</option>
      </select>
    </>
  );
}

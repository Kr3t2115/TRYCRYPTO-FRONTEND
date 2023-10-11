import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

export default async function Login(
  objectToSend: any,
  navigate: any,
  setAuth: any,
  setCurrentBalance: any
) {
  axios
    .post(import.meta.env.VITE_API_URL + "/user/login", objectToSend, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      setAuth(true);

      GetWalletBalance(setCurrentBalance);

      navigate("/");

      return response;
    })
    .catch((response) => {
      return response;
    });
}

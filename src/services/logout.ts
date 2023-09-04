import axios from "axios";

export default function Logout(setAuth: any) {
  axios
    .get("https://api.trycrypto.pl/api/user/logout", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res: any) => {

      setAuth(false)

      console.log(res);
    })
    .catch((response) => {
      return response;
    });
}

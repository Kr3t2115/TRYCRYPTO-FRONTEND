import axios from "axios";

export default function refreshToken() {
  axios.get("https://api.trycrypto.pl/user/refresh/token", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

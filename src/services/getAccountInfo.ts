import axios from "axios";

export default function GetAccountInfo(setAccountDetails: any) {
  axios
    .get(import.meta.env.VITE_API_URL + "/api/user", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log(res.data);
      setAccountDetails(res.data);
    })
    .catch((err) => {
      throw new Error(err);
    });
}

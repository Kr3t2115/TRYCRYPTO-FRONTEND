import axios from "axios";

export default function GetWalletBalance(setCurrentBalance: any) {
  axios
    .get("https://api.trycrypto.pl/api/wallet/balance", {
      withCredentials: true,
    })
    .then((response) => {
      setCurrentBalance(JSON.stringify(response.data));
    })
    .catch((error) => {
      throw new Error(error);
    });
}

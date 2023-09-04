import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

export default function SellCrypto(
  symbol: string,
  quantity: any,
  setCurrentBalance: any
) {
  axios
    .post(
      import.meta.env.VITE_API_URL + "/api/spot/market/sell/" + symbol,
      {
        quantity: quantity,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      GetWalletBalance(setCurrentBalance);
    })
    .catch((error) => {
      throw new Error(error);
    });
}

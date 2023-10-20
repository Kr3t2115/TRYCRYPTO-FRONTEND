import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

export default async function BuyCrypto(
  symbol: string,
  quantity: number,
  setCurrentBalance: any
) {
  try {

    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/api/spot/market/buy/" + symbol,
      {quantity: quantity},{withCredentials: true}
    )

    if(res.status === 200) {
      GetWalletBalance(setCurrentBalance);
    }
  } catch (error: unknown) {
    if(error instanceof Error) {
      throw new Error(error.message)
    }
  }
  axios
    .post(
      import.meta.env.VITE_API_URL + "/api/spot/market/buy/" + symbol,
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
      console.log(response);

      GetWalletBalance(setCurrentBalance);
    })
    .catch((error) => {
      console.log(error);
    });
}

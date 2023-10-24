import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

type postBodyType = {
  quantity: number;
  price: number;
  type: "SHORT" | "LONG";
  takeProfit: number;
  stopLoss: number;
  leverage: number;
};

export default async function openOrderFutures(
  pair: string,
  postBody: postBodyType,
  setCurrentBalance: any
) {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/api/derivatives/limit/open/" + pair,
      postBody,
      { withCredentials: true }
    );

    if (res.status === 200) {
      GetWalletBalance(setCurrentBalance);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

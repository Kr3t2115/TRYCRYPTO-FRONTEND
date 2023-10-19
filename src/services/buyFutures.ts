import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

type objectType = {
  quantity: number;
  type: string;
  takeProfit: number;
  stopLoss: number;
  leverage: number;
};

export const BuyFutures = async (
  symbol: string,
  body: objectType,
  setCurrentBalance: void
) => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/api/derivatives/market/open/" + symbol,
      body,
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
};

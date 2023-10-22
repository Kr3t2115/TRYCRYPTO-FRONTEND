import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

export const SellFutures = async (
  id: number,
  quantity: number,
  setCurrentBalance: any
) => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/api/derivatives/market/close/" + id,
      { quantity: quantity },
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

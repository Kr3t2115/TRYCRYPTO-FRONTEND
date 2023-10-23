import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

export default async function futurePositionUpdate(
  id: number,
  stopLoss: number,
  takeProfit: number,
  setCurrentBalance: any
) {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/api/derivatives/position/update/" + id,
      { stopLoss: Number(stopLoss), takeProfit: Number(takeProfit) },
      { withCredentials: true }
    );

    if (res.status === 200) {
      GetWalletBalance(setCurrentBalance);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

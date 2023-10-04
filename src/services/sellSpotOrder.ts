import GetWalletBalance from "./getWalletBalance";
import axios from "axios";

interface selledData {
  pair: string;
  quantity: number;
  price: number
}

export default async function sellSpotOrder(
  selledData: selledData,
  setCurrentBalance: any
) {
  try {
    console.log(selledData);

    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/api/spot/limit/sell/" + selledData.pair,
      { quantity: selledData.quantity, price: selledData.price },
      { withCredentials: true }
    );

    GetWalletBalance(setCurrentBalance);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
}

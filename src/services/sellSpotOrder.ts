import GetWalletBalance from "./getWalletBalance";
import axios from "axios";



export default async function sellSpotOrder(
  closedId: number,
  setCurrentBalance: any
) {
  try {

    const res = await axios.get(
      import.meta.env.VITE_API_URL + "/api/spot/limit/close/" + closedId,
      { withCredentials: true }
    );

    GetWalletBalance(setCurrentBalance);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
}

import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

export default function orderSpot(symbol: string , quantity: number, price: number, setCurrentBalance: any) {
    axios.post(import.meta.env.VITE_API_URL + '/api/spot/limit/buy/' + symbol, {
        quantity: quantity,
        price: price
      }, {      
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
      })
      .then((response) => {
          GetWalletBalance(setCurrentBalance)
      })
      .catch((error) => {
       throw new Error(error);
      });
}
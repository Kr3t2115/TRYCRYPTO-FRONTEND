import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

export default function BuyCrypto(symbol : string, quantity: any, setCurrentBalance: any) {
    console.log("buy")

    axios.post(import.meta.env.VITE_API_URL + '/api/spot/market/buy/' + symbol, {
        quantity: quantity
      }, {      
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
          },
    })
      .then((response) => {
        console.log(response);
    
        GetWalletBalance(setCurrentBalance);
      })
      .catch((error) => {
        console.log(error);
      });
}
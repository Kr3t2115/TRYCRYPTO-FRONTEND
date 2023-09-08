import axios from "axios";

export default function orderSpot(symbol: any , quantity: number, price: number) {
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
    
        })
      .catch((error) => {
        console.log(error);
      });
}
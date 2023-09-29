import axios from "axios";

export default async function GetWalletBalance(setCurrentBalance: any) {
  try {
    const balance = await axios.get("https://api.trycrypto.pl/api/wallet/balance", {
      withCredentials: true,
    });
    
    const sportOrders = await axios.get("https://api.trycrypto.pl/api/spot/limit/orders", {withCredentials: true})

    const futureOrders = await axios.get("https://api.trycrypto.pl/api/derivatives/limit/orders", {withCredentials: true})

    let ostateczny  = {...balance.data, sportOrders: sportOrders.data ,futureOrders: futureOrders.data };
    
    setCurrentBalance(JSON.stringify(ostateczny));    

  } catch (error: unknown) {
    if(error instanceof Error) {
      console.log(error)
    }
  }
}

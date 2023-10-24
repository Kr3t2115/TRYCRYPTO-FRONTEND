import axios from "axios";

export default async function GetWalletBalance(setCurrentBalance: any) {
  try {
    const balance = await axios.get(
      import.meta.env.VITE_API_URL + "/api/wallet/balance",
      {
        withCredentials: true,
      }
    );

    const sportOrders = await axios.get(
      import.meta.env.VITE_API_URL + "/api/spot/limit/orders",
      { withCredentials: true }
    );

    const futureOrders = await axios.get(
      import.meta.env.VITE_API_URL + "/api/derivatives/limit/orders",
      { withCredentials: true }
    );

    let ostateczny = {
      ...balance.data,
      spotOrders: sportOrders.data,
      futureOrders: futureOrders.data,
    };

    setCurrentBalance(JSON.stringify(ostateczny));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

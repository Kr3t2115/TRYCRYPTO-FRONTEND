import axios from "axios";
import "vite/client";

type objectSendedType = {
  email: string;
  password: string;
};

const login = async (
  objectToSend: objectSendedType,
  navigate: any,
  setAuth: any,
  setCurrentBalance: any
) => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/user/login",
      objectToSend,
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      setAuth(true);
      getWalletBalance(setCurrentBalance);
      navigate("/");
      return res.data;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

const logout = async (setAuth: any) => {
  try {
    const res = await axios.get(
      import.meta.env.VITE_API_URL + "/api/user/logout",
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      setAuth(false);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

const register = async (objectToSend: any, navigate: any) => {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/user/register",
      objectToSend,
      { withCredentials: true }
    );

    if (res.status === 200) {
      navigate("/login");
      return res.data;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

const refreshToken = async () => {
  try {
    const res = await axios.get("https://api.trycrypto.pl/user/refresh/token", {
      withCredentials: true,
    });

    if (res.status === 200) {
      console.log("Token refreshed");
      return true;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

const getAccountInfo = async (setAccountDetails: any) => {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + "/api/user", {
      withCredentials: true,
    });

    setAccountDetails(res.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

const getWalletBalance = async (setCurrentBalance: any) => {
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
};

export {
  login,
  logout,
  register,
  refreshToken,
  getAccountInfo,
  getWalletBalance,
};

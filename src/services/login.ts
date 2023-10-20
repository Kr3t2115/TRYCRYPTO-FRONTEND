import axios from "axios";
import GetWalletBalance from "./getWalletBalance";

export default async function Login(
  objectToSend: any,
  navigate: any,
  setAuth: any,
  setCurrentBalance: any
) {


  try {

    const res = await  axios
    .post(import.meta.env.VITE_API_URL + "/user/login", objectToSend, {
      withCredentials: true})
    
      if(res.status === 200) {
        setAuth(true);

        GetWalletBalance(setCurrentBalance);
  
        navigate("/");

        return res.data;
      }

  } catch (error: unknown) {
    if(error instanceof Error) {
      throw new Error(error.message)
    }
  }
  

}

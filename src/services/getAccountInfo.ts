import axios from "axios";

export default async function GetAccountInfo(setAccountDetails: any) {

  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + "/api/user", {withCredentials: true})

      setAccountDetails(res.data)
  } catch (error: unknown) {
    if(error instanceof Error) {
      console.log(error.message)
    }
  }
 
}

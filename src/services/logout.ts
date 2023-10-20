import axios from "axios";

export default async function Logout(setAuth: any) {

  try {

    const res = await  axios.get("https://api.trycrypto.pl/api/user/logout", 
    {withCredentials: true});

    if(res.status === 200) {
      setAuth(false)
    }    
  } catch (error: unknown) {
    if(error instanceof Error) {
      throw new Error(error.message)
    }
  }
}

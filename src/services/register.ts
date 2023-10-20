import axios from "axios";

export default async function RegisterApi(objectToSend: any, navigate: any) {
  try {
    const res = await axios.post(import.meta.env.VITE_API_URL + "/user/register", 
    objectToSend, {withCredentials: true})

    if(res.status === 200) {
      navigate("/login");
      return res.data;
    }
  } catch (error: unknown) {
    if(error instanceof Error) {
      throw new Error(error.message)
    }
  }
}

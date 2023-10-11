import axios from "axios";

export default function checkRegisterKey(key: string | undefined) {
  axios.post("", { key: key });
}

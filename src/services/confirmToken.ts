import axios from "axios";

export default function confirmToken(
  token: string | undefined,
  emailNumber: string | undefined
) {
  axios.post("", { token: token, emailNumber: emailNumber });
}

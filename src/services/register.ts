export default async function RegisterApi(objectToSend: any, navigate: any) {
  const sendRequest = await fetch(
    import.meta.env.VITE_API_URL + "/user/register",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(objectToSend),
      credentials: "same-origin",
    }
  );

  if (!sendRequest.ok) {
    throw new Error(sendRequest.statusText);
  } else {
    const response = await sendRequest.json();

    navigate("/login");

    return response;
  }
}

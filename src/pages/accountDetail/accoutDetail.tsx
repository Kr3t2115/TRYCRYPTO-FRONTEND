import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import GetAccountInfo from "../../services/getAccountInfo";

interface AccountDetail {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  profilePicture: string | null;
  username: string | null;
}

export default function AccountDetail() {
  const { currentBalance }: any = useContext(AuthContext);

  const [spotBalance, setSpotBalance] = useState({});
  const [futureBalance, setFutureBalance] = useState({});

  const [accountDetails, setAccountDetails] = useState<AccountDetail>();

  useEffect(() => {
    let parsed = JSON.parse(currentBalance);

    console.log(parsed);

    if (parsed.spotBalance !== null) {
      setSpotBalance(parsed.spotBalance);
    }

    if (parsed.futureBalance !== null) {
      setFutureBalance(parsed.futureBalance);
    }
  }, [currentBalance]);

  useEffect(() => {
    GetAccountInfo(setAccountDetails);
  }, []);

  const changeAvatar = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <div>
        <div>Account details</div>
        <img
          src={
            accountDetails?.profilePicture === null
              ? " https://api.trycrypto.pl/uploads/default.png"
              : import.meta.env.VITE_API_URL +
                "/uploads/" +
                accountDetails?.profilePicture
          }
        ></img>

        <form>
          <input type="file"></input>
          <button type="submit" onClick={changeAvatar}>
            Change avatar
          </button>
        </form>
        <div>Firstname: {accountDetails?.firstname}</div>
        <div>Lastname: {accountDetails?.lastname}</div>
        <div>Username: {accountDetails?.username}</div>
        <div>Email: {accountDetails?.email}</div>
      </div>

      <div>
        <div>Opened position(spot)</div>

        <ul>
          {Object.entries(spotBalance).map(([key, value]: any) => {
            let indexOfName = key.search("USDT");

            let imageName = key.slice(0, indexOfName).toLowerCase();

            let imageLink = import.meta.env.VITE_API_URL + "/icon/" + imageName;

            return (
              <li>
                <img src={imageLink}></img>
                {key} {value}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div>Opened position(futures &#10060;)</div>

        <ul>
          {" "}
          {Object.entries(futureBalance).map(([key, value]: any) => {
            return (
              <li>
                {key} {value}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

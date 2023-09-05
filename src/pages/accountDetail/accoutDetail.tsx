import axios from "axios";
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

  const [newUserPic , setNewUserPic] = useState<any>();

  useEffect(() => {
    let parsed = JSON.parse(currentBalance);

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

    setNewUserPic(false)

    let form = new FormData();

    form.append("profilePicture" , newUserPic);

    axios.patch(import.meta.env.VITE_API_URL + "/api/user/profile/picture",form, {
      withCredentials: true,
    }).then((res) => {
      GetAccountInfo(setAccountDetails);
    })
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

          {newUserPic && <div>
            <img src={URL.createObjectURL(newUserPic)} alt="" />
            </div>}


        <form>
          <input type="file" onChange={(e: any) => {
            setNewUserPic(e.target.files[0])
          }}></input>
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

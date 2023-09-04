import Class from "./navbar.module.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";
import Logout from "../../services/logout";
import { OverlayTrigger, Tooltip, Modal } from "react-bootstrap";

export default function Navbar() {
  const { auth, currentBalance, setAuth }: any = useContext(AuthContext);

  const [balance, setBalance] = useState<number>(0);

  const [loggedOut, setLoggedOut] = useState<boolean>(false);

  useEffect(() => {
    if (currentBalance !== "{}") {
      let son = JSON.parse(currentBalance);

      setBalance(son.currentBalance);
    }
  }, [currentBalance]);

  const handleLogout = () => {
    Logout(setAuth);
    setLoggedOut(true);
  };

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>This is your current accout balance</strong>.
    </Tooltip>
  );

  return (
    <div className={`container ${Class.navigation}`}>
      <div className="row">
        <Link to="" className={`${Class.miniContainer}` + " col-lg-3"}>
          <img
            className={"img-fluid " + Class.logo}
            src={Logo}
            alt="logo"
          ></img>
        </Link>
        <div className={`${Class.miniContainer}` + " col-lg"}>
          <div className={Class.nav}>
            <Link to="">
              <span>Home</span>
            </Link>
            <Link to="markets">
              <span>Markets</span>
            </Link>
            <Link to="">
              <span>Ranking</span>
            </Link>
          </div>
        </div>

        {auth === true ? (
          <div className={Class.miniContainer + " col-lg-3"}>
            <div className={Class.balance}>
              <Link to="accountDetail" className={Class.balanceLink}>
                <OverlayTrigger placement="bottom" overlay={tooltip}>
                  <div className={Class.balance}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-wallet"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
                    </svg>
                    {balance.toFixed(2) + " $"}
                  </div>
                </OverlayTrigger>
              </Link>

              <button onClick={handleLogout} className={Class.balanceButton}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className={`${Class.miniContainer}` + " col-lg-3"}>
            <div className={Class.nav}>
              <Link to="login">
                <span>Login</span>
              </Link>

              <Link to="register">
                <span>Register</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Modal
        show={loggedOut}
        onHide={() => {
          setLoggedOut(false);
        }}
        backdrop="static"
        keyboard={false}
        className={Class.modal}
      >
        <Modal.Header>
          <Modal.Title>Logged out</Modal.Title>
          <button
            onClick={() => {
              setLoggedOut(false);
            }}
            style={{
              backgroundColor: "transparent",
              border: "0px",
              color: "var(--font-color)",
              fontSize: "30px",
            }}
          >
            &#10005;
          </button>
        </Modal.Header>
        <Modal.Body>You successfully logged out</Modal.Body>
      </Modal>
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import Class from "./sideCryptoPrice.module.css";
import { Modal, Button, Form, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "../../../../context/authContext";
import { Link } from "react-router-dom";
import BuyCrypto from "../../../../services/buyCrypto";
import SellCrypto from "../../../../services/sellCrypto";

interface TickerInterface {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  ps: string; // Pair
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  c: string; // Last price
  Q: string; // Last quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded volume
  q: string; // Total traded base asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // Last trade Id
  n: number; // Total number of trades
}

interface SpotDataInterface {
  quantity: number,
  maxQuantity: number,
  maxSellQuantity: number,
  sellQuantity: number,
}

export default function SideCryptoPrice({ symbol }: any) {
  const { currentBalance, auth, setCurrentBalance }: any =
    useContext(AuthContext);

  const [data, setData] = useState<TickerInterface>({
    e: "", // Event type
    E: 0, // Event time
    s: "", // Symbol
    ps: "", // Pair
    p: "", // Price change
    P: "", // Price change percent
    w: "", // Weighted average price
    c: "", // Last price
    Q: "", // Last quantity
    o: "", // Open price
    h: "", // High price
    l: "", // Low price
    v: "", // Total traded volume
    q: "", // Total traded base asset volume
    O: 0, // Statistics open time
    C: 0, // Statistics close time
    F: 0, // Last trade Id
    n: 0, // Total number of trades
  });

  let modalBody;

  const [show, setShow] = useState<boolean>(false);

  const [spotData, setSpotData] =  useState<SpotDataInterface>({
    maxQuantity: 0, 
    maxSellQuantity: 0,
    quantity: 0,
    sellQuantity: 0,
  });

  const [action, setAction] = useState<string>("Buy");

  const formatNumber = (num: number, dec = 1) => {
    const calcDec = Math.pow(10, dec);

    return Math.trunc(num * calcDec) / calcDec;
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const changeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    let a = parseFloat(event.target.value);

    setSpotData((prev) : SpotDataInterface => {
        return {...prev, quantity: a}
    });
  };

  const changeSellQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpotData((prev) : any => {
      return {...prev, sellQuantity: event.target.value}
  });  };

  const handleForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    BuyCrypto(symbol, spotData?.quantity, setCurrentBalance);
    setShow(false)
  };

  const handleSell = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    SellCrypto(symbol, spotData?.sellQuantity, setCurrentBalance);
  };

  let indexOfName = symbol?.search("USDT");

  let imageName = symbol?.slice(0, indexOfName).toLowerCase();

  let imageLink = import.meta.env.VITE_API_URL + "/icon/" + imageName;

  let lower = symbol.toLowerCase();

  const { lastJsonMessage } = useWebSocket<any>(
    `wss://stream.binance.com:9443/ws/${lower}@ticker`
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setData(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if(auth) {
      let parsed = JSON.parse(currentBalance);
      let current = parsed.currentBalance;
      let newMax = formatNumber(parseFloat(current) / parseFloat(data.c));
      setSpotData((prev): any => {
        return {...prev, maxQuantity: newMax}
      })
      if (parsed.spotBalance[symbol] != "undefined") {

        setSpotData((prev): any => {
          return {...prev, maxSellQuantity: parsed.spotBalance[symbol]}
        })
      }
      }
  }, [data.c]);

  useEffect(() => {
  if(auth) {
      let parsed = JSON.parse(currentBalance);
      if (parsed.spotBalance[symbol] != "undefined") {
        setSpotData((prev): any => {
          return {...prev, maxSellQuantity: parsed.spotBalance[symbol]}
        })      }
    }
  }, [currentBalance]);

  if (auth == true) {
    modalBody = (
      <Tabs
        defaultActiveKey="buy"
        id="uncontrolled-tab-example"
        onSelect={(e) => {
          if (e == "buy") {
            setAction("Buy");
          } else if (e == "sell") {
            setAction("Sell");
          }
          else if(e == "order") {
            setAction("Order");
          }
        }}
      >
        <Tab eventKey="buy" title="Buy">
          <input
            type="range"
            max={spotData.maxQuantity}
            min={0}
            value={spotData.quantity}
            onChange={changeQuantity}
            step={0.1}
          />

          <input
            type="number"
            max={spotData.maxQuantity}
            className={Class.input}
            value={spotData.quantity}
            onChange={changeQuantity}
          ></input>

          <button
            type="button"
            className={Class.button + " " + Class.buttonSubmit}
            onClick={(e) => {
              handleForm(e)
            }}
          >
            Buy
          </button>
        </Tab>
        <Tab eventKey="sell" title="Sell">
          <input
            type="range"
            max={spotData.maxSellQuantity}
            min={0}
            value={spotData.sellQuantity}
            onChange={changeSellQuantity}
            step={0.1}
          />

          <Form.Control
            type="number"
            max={spotData.maxSellQuantity}
            className={Class.input}
            value={spotData.sellQuantity}
            onChange={changeSellQuantity}
          ></Form.Control>

          <button
            type="button"
            className={Class.button + " " + Class.buttonSubmit}
            onClick={(e) => {
              handleSell(e)
            }}
          >
            Sell
          </button>
        </Tab>

        <Tab eventKey="order" title="Order">
adsasd
        </Tab>
      </Tabs>
    );
  } else {
    modalBody = (
      <div className={Class.loginHrefCont}>
        <Link to="/login" className={Class.loginHref}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className={Class.buycryptoPrice}>
        <table className={Class.table}>
          <tbody>
            <tr>
              <td>
                <img src={imageLink} alt={symbol + "icon"}></img> {symbol}
              </td>
            </tr>
            <tr>
              <td>Open price:</td>
              <td>{parseFloat(data.o)}</td>
            </tr>

            <tr>
              <td>Low price:</td>
              <td>{parseFloat(data.l)}</td>
            </tr>

            <tr>
              <td>High price:</td>
              <td>{parseFloat(data.h)}</td>
            </tr>

            <tr>
              <td>Current price:</td>
              <td>{parseFloat(data.c)}</td>
            </tr>

            <tr>
              <td>Price change:</td>
              <td>
                {parseFloat(data.p)}$ {parseFloat(data.P).toFixed(2)}%
              </td>
            </tr>

            <tr>
              <td>Volume:</td>
              <td>{parseFloat(data.q).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <Button onClick={handleShow} className={Class.button}>
          Buy/Sell {symbol}
        </Button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className={Class.modal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {action} {symbol}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className={Class.button}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

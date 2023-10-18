import { ChangeEvent, useContext, useEffect, useState } from "react";
import Class from "./sideCryptoPrice.module.css";
import useWebSocket from "react-use-websocket";
import { Modal, Button, Form, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "../../../../context/authContext";
import SellCrypto from "../../../../services/sellCrypto";
import BuyCrypto from "../../../../services/buyCrypto";
import { Link } from "react-router-dom";


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

type FutureTypes = {
  buy: {
    maxQuantity: number,
    quantity: number,
    leverage: number,
    type: "SHORT" | "LONG",
    takeProfit: number,
    stopLoss: number,
  }, 
  sell: {
    maxQuantity: number,
    quantity: number,
  },
  orderOpen: {
    maxQuantity: number,
    quantity: number,
    price: number,
    type: "SHORT" | "LONG",
    takeProfit: number,
    stopLoss: number,
  }
}


export default function SideCryptoPrice({ symbol }: {symbol: string}) {
  const { currentBalance, auth, setCurrentBalance }: any =
    useContext(AuthContext);

  const [show, setShow] = useState<boolean>(false);

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

  const [action, setAction] = useState<string>("Buy");

  const [futuresData, setFuturesData] = useState<FutureTypes>({
    buy: {
      maxQuantity: 0,
      quantity: 0,
      leverage: 0,
      type: "SHORT",
      stopLoss: 0,
      takeProfit: 0
    },
    sell: {
      maxQuantity: 0,
      quantity: 0,
    },
    orderOpen: {
      maxQuantity: 0,
      quantity: 0,
      type: "SHORT",
      takeProfit: 0,
      stopLoss: 0,
      price: 0,
      }
  });


  const handleChange = (action: "buy" | "sell" | "orderOpen", event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {

    console.log(futuresData[action][event.target.name])

    setFuturesData((prev): FutureTypes => {
      return {...prev}
    })
  }

  let indexOfName = symbol?.search("USDT");

  let imageName = symbol?.slice(0, indexOfName).toLowerCase();

  let imageLink = import.meta.env.VITE_API_URL + "/icon/" + imageName;

  let lower = symbol.toLowerCase();

  let modalBody;

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const handleForm = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setShow(false);
  };

  const handleSell = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const { lastJsonMessage } = useWebSocket<any>(
    `wss://fstream.binance.com/ws/${lower}@ticker`
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setData(lastJsonMessage);
    }
  }, [lastJsonMessage]);

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
        }}
      >
        <Tab eventKey="buy" title="Buy">
          <label htmlFor="buyQuantity">Pass quantity to buy</label>
          <input
          name="quantity"
            type="range"
            max={futuresData.buy.maxQuantity}
            min={0}
            value={futuresData.buy.quantity}
            onChange={(e) => {
              handleChange("buy", e)
            }}
            step={0.1}
          />

          <input
                    name="quantity"
            type="number"
            max={futuresData.buy.maxQuantity}
            className={Class.input}
            value={futuresData.buy.quantity}
            onChange={(e) => {
              handleChange("buy", e)
            }}
            step={0.1}
            id="buyQuantity"
          ></input>


          <Form.Select aria-label="Default select example"  name="type" onChange={(e) => {
              handleChange("buy", e)
            }}>           
             <option value="SHORT">SHORT</option>
            <option value="LONG">LONG</option>
          </Form.Select>


          <button
            type="button"
            className={Class.button + " " + Class.buttonSubmit}
            onClick={(e) => {
              handleForm(e);
            }}
          >
            Buy
          </button>
        </Tab>
        {/* <Tab eventKey="sell" title="Sell">
          <input
            type="range"
            max={maxSellQuantity}
            min={0}
            value={sellQuantity}
            onChange={changeSellQuantity}
            step={0.1}
          />

          <Form.Control
            type="number"
            max={maxSellQuantity}
            className={Class.input}
            value={sellQuantity}
            onChange={changeSellQuantity}
          ></Form.Control>

          <button
            type="button"
            className={Class.button + " " + Class.buttonSubmit}
            onClick={(e) => {
              handleSell(e);
            }}
          >
            Sell
          </button>
        </Tab> */}

        <Tab eventKey="order" title="Order">
            
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

import { ChangeEvent, useContext, useEffect, useState } from "react";
import Class from "./sideCryptoPrice.module.css";
import useWebSocket from "react-use-websocket";
import { Modal, Button, Form, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "../../../../context/authContext";
import { Link } from "react-router-dom";
import type { AuthType } from "../../../../context/authContext";
import { BuyFutures } from "../../../../services/buyFutures";

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
    maxQuantity: number;
    quantity: number;
    leverage: number;
    type: "SHORT" | "LONG";
    takeProfit: number;
    stopLoss: number;
  };
  sell: {
    maxShortSell: number;
    currentShortSell: number;
    maxLongSell: number;
    currentLongtSell: number;
  };
  orderOpen: {
    maxQuantity: number;
    quantity: number;
    price: number;
    type: "SHORT" | "LONG";
    takeProfit: number;
    stopLoss: number;
    leverage: number;
  };
};

export default function SideCryptoPrice({ symbol }: { symbol: string }) {
  const { currentBalance, auth, setCurrentBalance }: AuthType =
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
      leverage: 1,
      type: "SHORT",
      stopLoss: 0,
      takeProfit: 0,
    },
    sell: {
      maxShortSell: 0,
      currentShortSell: 0,
      maxLongSell: 0,
      currentLongtSell: 0,
    },
    orderOpen: {
      maxQuantity: 0,
      quantity: 0,
      type: "SHORT",
      takeProfit: 0,
      stopLoss: 0,
      price: 0,
      leverage: 1,
    },
  });

  const handleChange = (
    action: "buy" | "sell" | "orderOpen",
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFuturesData((prev): FutureTypes => {
      return {
        ...prev,
        [action]: {
          ...prev[action],
          [event.target.name]:
            event.target.name !== "type"
              ? parseFloat(event.target.value)
              : event.target.value,
        },
      };
    });
  };

  const handleBuy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    BuyFutures(symbol, {
      quantity: futuresData.buy.quantity,
      type: futuresData.buy.type,
      takeProfit: futuresData.buy.takeProfit,
      stopLoss: futuresData.buy.stopLoss,
      leverage: futuresData.buy.leverage,
    }, setCurrentBalance);
  };

  let indexOfName = symbol?.search("USDT");

  let imageName = symbol?.slice(0, indexOfName).toLowerCase();

  let imageLink = import.meta.env.VITE_API_URL + "/icon/" + imageName;

  let lower = symbol.toLowerCase();

  let modalBody;

  const formatNumber = (num: number, dec = 1) => {
    const calcDec = Math.pow(10, dec);

    return Math.trunc(num * calcDec) / calcDec;
  };

  const settingShow = (newShow: boolean) => {
    setShow(newShow);
  };

  const { lastJsonMessage } = useWebSocket<any>(
    `wss://fstream.binance.com/ws/${lower}@ticker`
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setData(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (auth) {
      let parsed = JSON.parse(currentBalance);
      let current = parsed.currentBalance;
      let newMax = formatNumber(parseFloat(current) / parseFloat(data.c));
      setFuturesData((prev): FutureTypes => {
        return {
          ...prev,
          buy: {
            ...prev.buy,
            maxQuantity: newMax,
          },
        };
      });
      if (
        parsed.spotBalance[symbol] != "undefined" ||
        !!parsed.spotBalance[symbol]
      ) {
        setFuturesData((prev): FutureTypes => {
          return {
            ...prev,
            sell: {
              ...prev.sell,
            },
          };
        });
      }
    }
  }, [data.c]);

  useEffect(() => {
    let parsed = JSON.parse(currentBalance);
    if (typeof parsed.futureBalance.short[symbol] !== undefined) {

      setFuturesData((prev): FutureTypes => {
        return {...prev, sell: {
          ...prev.sell,
          maxShortSell: parseFloat(parsed.futureBalance.short[symbol])
        }}
      })
    }
  }, [currentBalance]);

  if (auth) {
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
              handleChange("buy", e);
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
              handleChange("buy", e);
            }}
            step={0.1}
            id="buyQuantity"
          ></input>

          <label htmlFor="buyLeverage">
            Set leverage power. Current: {futuresData.buy.leverage}
          </label>

          <input
            name="leverage"
            type="range"
            min={1}
            max={50}
            className={Class.input}
            value={futuresData.buy.leverage}
            onChange={(e) => {
              handleChange("buy", e);
            }}
            step={1}
            id="buyLeverage"
          ></input>

          <label htmlFor="buyFutureType">Set type</label>

          <Form.Select
            id="buyFutureType"
            aria-label="Default select example"
            name="type"
            onChange={(
              e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
            ) => {
              handleChange("buy", e);
            }}
          >
            <option value="SHORT">SHORT</option>
            <option value="LONG">LONG</option>
          </Form.Select>

          <label htmlFor="sellingPrice">Set selling price.</label>
          <input
            name="takeProfit"
            min={data.c}
            type="number"
            className={Class.input}
            value={futuresData.buy.takeProfit}
            onChange={(e) => {
              handleChange("buy", e);
            }}
            step={0.1}
            id="buyLeverage"
          ></input>

          <label htmlFor="stopLoss">Set stop loss price.</label>
          <input
            name="stopLoss"
            max={data.c}
            type="number"
            className={Class.input}
            value={futuresData.buy.stopLoss}
            onChange={(e) => {
              handleChange("buy", e);
            }}
            step={0.1}
            id="stopLoss"
          ></input>

          <button
            type="button"
            className={Class.button + " " + Class.buttonSubmit}
            onClick={(e) => {
              handleBuy(e);
            }}
          >
            Buy
          </button>
        </Tab>

        <Tab eventKey="sell" title="Sell">
          <div>Short</div>
          <span>Current sell quantity: {futuresData.sell.currentShortSell}</span>
          <input
          name="currentShortSell"
          type="range"
          min={0}
          max={futuresData.sell.maxShortSell}
          step={0.1}
          value={futuresData.sell.currentShortSell}
          onChange={(e) => {
            handleChange("sell" , e);
          }}
          ></input>
          <div>Long</div>
          <input></input>
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

      <Button
        onClick={() => {
          settingShow(true);
        }}
        className={Class.button}
      >
        Buy/Sell {symbol}
      </Button>

      <Modal
        show={show}
        onHide={() => {
          settingShow(false);
        }}
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
            onClick={() => {
              settingShow(false);
            }}
            className={Class.button}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

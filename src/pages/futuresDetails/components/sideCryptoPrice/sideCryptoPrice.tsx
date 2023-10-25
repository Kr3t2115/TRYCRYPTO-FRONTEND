import { useContext, useEffect, useState } from "react";
import Class from "./sideCryptoPrice.module.css";
import useWebSocket from "react-use-websocket";
import { Modal, Button, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "../../../../context/authContext";
import { Link } from "react-router-dom";
import type { AuthType } from "../../../../context/authContext";
import getPositionsByPair from "../../../../services/getPositionsByPair";
import Buy from "./components/buy";
import Sell from "./components/sell";
import Order from "./components/order";

interface TickerInterface {
  e: string;
  E: number;
  s: string;
  ps: string;
  p: string;
  P: string;
  w: string;
  c: string;
  Q: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
  O: number;
  C: number;
  F: number;
  n: number;
}

interface SellType {
  id: number;
  leverage: number;
  liquidationPrice: number;
  pair: string;
  purchasePrice: number;
  quantity: number;
  stopLoss: number | null;
  takeProfit: number | null;
  type: "SHORT" | "LONG";
  userId: number;
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
  sell: Array<SellType>;
  selledFutureShort: { [k: number]: number };
  selledFutureLong: { [k: number]: number };
  updateFutures: {
    [k: number]: { newTakeProfit: number; newStopLoss: number };
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
    e: "",
    E: 0,
    s: "",
    ps: "",
    p: "",
    P: "",
    w: "",
    c: "",
    Q: "",
    o: "",
    h: "",
    l: "",
    v: "",
    q: "",
    O: 0,
    C: 0,
    F: 0,
    n: 0,
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
    sell: [],
    updateFutures: {},
    selledFutureShort: {},
    selledFutureLong: {},
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
  let indexOfName = symbol?.search("USDT");

  let imageName = symbol?.slice(0, indexOfName).toLowerCase();

  let imageLink = import.meta.env.VITE_API_URL + "/icon/" + imageName;

  let lower = symbol.toLowerCase();

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
    }
  }, [data.c]);

  useEffect(() => {
    let positions = getPositionsByPair(symbol);

    positions.then((res) => {
      if (Array.isArray(res)) {
        setFuturesData((prev): FutureTypes => {
          return { ...prev, sell: res };
        });

        let arr: { id: number; selledQuantity: number }[] = [];
        let updateArr: {
          id: number;
          newTakeProfit: number;
          newStopLoss: number;
        }[] = [];
        res.map((val) => {
          arr.push({ id: val.id, selledQuantity: val.quantity });

          updateArr.push({
            id: val.id,
            newTakeProfit: val.takeProfit === null ? 0 : val.takeProfit,
            newStopLoss: val.stopLoss === null ? 0 : val.stopLoss,
          });
        });
        let a = arr.reduce((a, v) => ({ ...a, [v.id]: 0 }), {});
        let b = updateArr.reduce(
          (aa, v) => ({
            ...aa,
            [v.id]: {
              newStopLoss: v.newStopLoss,
              newTakeProfit: v.newTakeProfit,
            },
          }),
          {}
        );
        setFuturesData((prev): FutureTypes => {
          return { ...prev, selledFutureShort: a, updateFutures: b };
        });
      }
    });
  }, [currentBalance, futuresData.sell]);

  return (
    <div>
      <table className={Class.table}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ textAlign: "center" }}>
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
        keyboard={true}
        className={Class.modal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {action} {symbol}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {auth ? (
            <Tabs
              defaultActiveKey="open"
              id="uncontrolled-tab-example"
              onSelect={(e) => {
                if (e == "open") {
                  setAction("Open position");
                } else if (e == "close") {
                  setAction("Close position");
                } else if (e == "order") {
                  setAction("Open order");
                }
              }}
            >
              <Tab eventKey="open" title="Open">
                <Buy
                  futuresData={futuresData}
                  setCurrentBalance={setCurrentBalance}
                  symbol={symbol}
                  data={data}
                  handleChange={handleChange}
                ></Buy>
              </Tab>

              <Tab eventKey="close" title="Close">
                <Sell
                  data={data}
                  setCurrentBalance={setCurrentBalance}
                  setFuturesData={setFuturesData}
                  symbol={symbol}
                  futuresData={futuresData}
                ></Sell>
              </Tab>

              <Tab title="Order" eventKey="order">
                <Order
                  data={data}
                  setCurrentBalance={setCurrentBalance}
                  futuresData={futuresData}
                  handleChange={handleChange}
                  symbol={symbol}
                ></Order>
              </Tab>
            </Tabs>
          ) : (
            <div className={Class.loginHrefCont}>
              <Link to="/login" className={Class.loginHref}>
                Login
              </Link>
            </div>
          )}
        </Modal.Body>
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

import { ChangeEvent, useContext, useEffect, useState } from "react";
import Class from "./sideCryptoPrice.module.css";
import useWebSocket from "react-use-websocket";
import { Modal, Button, Form, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "../../../../context/authContext";
import { Link } from "react-router-dom";
import type { AuthType } from "../../../../context/authContext";
import { BuyFutures } from "../../../../services/buyFutures";
import getPositionsByPair from "../../../../services/getPositionsByPair";
import { SellFutures } from "../../../../services/sellFutures";
import futurePositionUpdate from "../../../../services/futurePositionUpdate";

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

interface SellType {
  id: number;
  leverage: number;
  liquidationPrice: number;
  pair: string;
  purchasePrice: number;
  quantity: number;
  stopLoss: number | null;
  takeProfit: number | null;
  type: string;
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
  selledFutures: { [k: number]: number };
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

  const [array, setArray] = useState([]);

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
    sell: [],
    updateFutures: {},
    selledFutures: {},
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

    BuyFutures(
      symbol,
      {
        quantity: futuresData.buy.quantity,
        type: futuresData.buy.type,
        takeProfit: futuresData.buy.takeProfit,
        stopLoss: futuresData.buy.stopLoss,
        leverage: futuresData.buy.leverage,
      },
      setCurrentBalance
    );
  };

  const handleSell = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();

    SellFutures(id, futuresData.selledFutures[id], setCurrentBalance);
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
          return { ...prev, selledFutures: a, updateFutures: b };
        });
      }
    });
  }, [currentBalance]);

  useEffect(() => {
    console.log(futuresData);
  }, [futuresData]);

  if (auth) {
    modalBody = (
      <Tabs
        defaultActiveKey="open"
        id="uncontrolled-tab-example"
        onSelect={(e) => {
          if (e == "open") {
            setAction("Open position");
          } else if (e == "close") {
            setAction("Close position");
          }
        }}
      >
        <Tab eventKey="open" title="Open">
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

        <Tab eventKey="close" title="Close">
          <div>Short</div>
          {futuresData.sell &&
            futuresData.sell.map((values: SellType) => {
              return (
                <div key={"selledFuture" + values.id}>
                  <p>
                    {values.pair} with {values.quantity} quantity
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <label>Stop loss</label>
                    <input
                      type="number"
                      defaultValue={
                        futuresData.updateFutures[values.id].newStopLoss
                      }
                      value={futuresData.updateFutures[values.id].newStopLoss}
                      max={values.purchasePrice}
                      onChange={(e) => {
                        setFuturesData((prev): FutureTypes => {
                          return {
                            ...prev,
                            updateFutures: {
                              ...prev.updateFutures,
                              [values.id]: {
                                ...prev.updateFutures[values.id],
                                newStopLoss: parseFloat(e.target.value),
                              },
                            },
                          };
                        });
                      }}
                    ></input>
                    <br></br>
                    <label>Take profit</label>
                    <input
                      type="number"
                      defaultValue={
                        futuresData.updateFutures[values.id].newTakeProfit
                      }
                      value={futuresData.updateFutures[values.id].newTakeProfit}
                      min={values.purchasePrice}
                      onChange={(e) => {
                        setFuturesData((prev): FutureTypes => {
                          return {
                            ...prev,
                            updateFutures: {
                              ...prev.updateFutures,
                              [values.id]: {
                                ...prev.updateFutures[values.id],
                                newTakeProfit: parseFloat(e.target.value),
                              },
                            },
                          };
                        });
                      }}
                    ></input>

                    <button
                      type="button"
                      onClick={() => {
                        futurePositionUpdate(
                          values.id,
                          futuresData.updateFutures[values.id].newStopLoss,
                          futuresData.updateFutures[values.id].newTakeProfit,
                          setCurrentBalance
                        );
                      }}
                    >
                      Change position
                    </button>
                  </form>

                  <input
                    type="range"
                    min={0}
                    max={values.quantity}
                    step={0.1}
                    onChange={(e) => {
                      setFuturesData((prev): FutureTypes => {
                        return {
                          ...prev,
                          selledFutures: {
                            ...prev.selledFutures,
                            [values.id]: parseFloat(e.target.value),
                          },
                        };
                      });
                    }}
                    value={futuresData.selledFutures[values.id]}
                    defaultValue={futuresData.selledFutures[values.id]}
                  ></input>
                  <button
                    type="button"
                    onClick={(e) => {
                      handleSell(e, values.id);
                    }}
                  >
                    Sell
                  </button>
                </div>
              );
            })}
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
        keyboard={true}
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

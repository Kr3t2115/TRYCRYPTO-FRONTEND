import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import getPositionsByPair from "../../../../../services/getPositionsByPair";
import futurePositionUpdate from "../../../../../services/futurePositionUpdate";
import { SellFutures } from "../../../../../services/sellFutures";
import { Dispatch, SetStateAction } from "react";
import "swiper/css";
import "swiper/css/navigation";

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

export default function Sell({
  futuresData,
  setCurrentBalance,
  setFuturesData,
  symbol,
  data,
}: {
  futuresData: FutureTypes;
  setFuturesData: Dispatch<SetStateAction<FutureTypes>>;
  setCurrentBalance: any;
  symbol: any;
  data: any;
}) {
  const handleSell = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();

    SellFutures(id, futuresData.selledFutureShort[id], setCurrentBalance);
  };

  return (
    <>
      {futuresData.sell && futuresData.sell.some((e) => e.type === "SHORT") && (
        <div>
          <div>Short</div>
          <Swiper
            centeredSlides={true}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            navigation
          >
            {futuresData.sell.map((values: SellType) => {
              if (values.type === "SHORT") {
                return (
                  <SwiperSlide key={"selledFuture" + values.id}>
                    <div style={{ padding: "0px 50px" }}>
                      <table style={{ width: "100%" }}>
                        <tr>
                          <th>Quantity: {values.quantity}</th>
                          <th>Leverage: {values.leverage}</th>
                          <th>
                            Take profit:{" "}
                            {values.takeProfit === null
                              ? "Not set"
                              : values.takeProfit}
                          </th>
                          <th>
                            Stop loss:{" "}
                            {values.stopLoss === null
                              ? "Not set"
                              : values.stopLoss}
                          </th>
                          <th>Purchase price: {values.purchasePrice}</th>
                        </tr>
                      </table>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();

                          futurePositionUpdate(
                            values.id,
                            futuresData.updateFutures[values.id].newStopLoss,
                            futuresData.updateFutures[values.id].newTakeProfit,
                            setCurrentBalance
                          );

                          let positions = getPositionsByPair(symbol);

                          positions.then((res) => {
                            if (Array.isArray(res)) {
                              setFuturesData((prev): FutureTypes => {
                                return { ...prev, sell: res };
                              });
                            }
                          });
                        }}
                      >
                        <label>Stop loss</label>
                        <input
                          type="number"
                          defaultValue={
                            futuresData.updateFutures[values.id].newStopLoss
                          }
                          value={
                            futuresData.updateFutures[values.id].newStopLoss
                          }
                          step={0.01}
                          min={data.c}
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
                          step={0.01}
                          value={
                            futuresData.updateFutures[values.id].newTakeProfit
                          }
                          max={data.c}
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

                        <button type="submit">Change position</button>
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
                              selledFutureShort: {
                                ...prev.selledFutureShort,
                                [values.id]: parseFloat(e.target.value),
                              },
                            };
                          });
                        }}
                        value={futuresData.selledFutureShort[values.id]}
                        defaultValue={futuresData.selledFutureShort[values.id]}
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
                  </SwiperSlide>
                );
              }
            })}
          </Swiper>
        </div>
      )}
    </>
  );
}

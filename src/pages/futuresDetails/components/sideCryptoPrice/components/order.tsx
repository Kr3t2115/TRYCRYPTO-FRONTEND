import { Form } from "react-bootstrap";
import Class from "../sideCryptoPrice.module.css";
import openOrderFutures from "../../../../../services/openOrderFutures";
import { useEffect, useRef, useState } from "react";

export default function Order({
  handleChange,
  data,
  futuresData,
  symbol,
  setCurrentBalance,
}: {
  handleChange: any;
  data: any;
  futuresData: any;
  symbol: any;
  setCurrentBalance: any;
}) {

  const [leverageProgres, setLeverageProgres] = useState<number>(1);

  const  levereageRef = useRef<HTMLInputElement | null>(null);

  const handleOrder = (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    openOrderFutures(
      symbol,
      {
        quantity: futuresData.orderOpen.quantity,
        price: futuresData.orderOpen.price,
        type: futuresData.orderOpen.type,
        takeProfit: futuresData.orderOpen.takeProfit,
        stopLoss: futuresData.orderOpen.stopLoss,
        leverage: futuresData.orderOpen.leverage,
      },
      setCurrentBalance
    );
  };
  useEffect(() => {

    levereageRef.current?.style.
    setProperty("--progress" , leverageProgres + "%");

  }, [leverageProgres])

  return (
    <>
      <label>Quantity</label>
      <input
        name="quantity"
        onChange={(e) => {
          handleChange("orderOpen", e);
        }}
        className={Class.input}
        type="number"
      ></input>

      <label>Price</label>
      <input
        onChange={(e) => {
          handleChange("orderOpen", e);
        }}
        name="price"
        className={Class.input}
        type="number"
      ></input>

      <label>Leverage</label>
      <input
      ref={levereageRef}
        onChange={(e) => {
          handleChange("orderOpen", e);

          let progress = (parseFloat(e.target.value) / parseFloat(e.target.max)) * 100;

          setLeverageProgres(progress);
        }}
        type="range"
        min={0}
        max={50}
        step={1}
        name="leverage"
        className={Class.dzigwnia}
      ></input>

      <label>Type</label>
      <select
        id="buyFutureType"
        aria-label="Default select example"
        name="type"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          handleChange("orderOpen", e);
        }}
        className={Class.select}
      >
        <option value="SHORT">SHORT</option>
        <option value="LONG">LONG</option>
      </select>

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
        className={Class.buttonSubmit +" " + Class.button}
        onClick={(e) => {
          handleOrder(e);
        }}
      >
        Open order
      </button>
    </>
  );
}

import { ChangeEvent } from "react";
import Class from "../sideCryptoPrice.module.css";
import { Form } from "react-bootstrap";
import { BuyFutures } from "../../../../../services/buyFutures";

export default function Buy({
  symbol,
  handleChange,
  futuresData,
  data,
  setCurrentBalance,
}: {
  symbol: any;
  handleChange: any;
  futuresData: any;
  data: any;
  setCurrentBalance: any;
}) {
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
  return (
    <>
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
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    </>
  );
}

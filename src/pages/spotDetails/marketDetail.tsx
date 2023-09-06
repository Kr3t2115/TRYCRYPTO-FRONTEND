import {  useParams } from "react-router-dom";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import Class from "./marketDetail.module.css";
import SideOrderBook from "./components/sideOrderBook/sideOrderBook";
import SideCryptoPrice from "./components/sideCryptoPrice/sideCryptoPrice";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function SpotDetails() {
  let { symbol } = useParams();

  return (
    <div className={Class.mainGrid}>

      <div className={Class.buycrypto}>
        <SideCryptoPrice symbol={symbol}></SideCryptoPrice>
      </div>

      <div className={Class.orderBook}>
        <SideOrderBook symbol={symbol}></SideOrderBook>
      </div>
    </div>
  );
}
    
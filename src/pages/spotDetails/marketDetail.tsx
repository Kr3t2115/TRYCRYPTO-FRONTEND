import {  useParams } from "react-router-dom";
import Class from "./marketDetail.module.css";
import SideOrderBook from "./components/sideOrderBook/sideOrderBook";
import SideCryptoPrice from "./components/sideCryptoPrice/sideCryptoPrice";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export default function SpotDetails() {
  let { symbol } = useParams();

  return (
    <div className={Class.mainGrid}>

      <div className={Class.buycrypto}>
        <SideCryptoPrice symbol={symbol}></SideCryptoPrice>
      </div>

      <div className={Class.chart}>
        <AdvancedRealTimeChart
          timezone="Europe/Berlin"
          theme="dark"
          symbol={`BINANCE:${symbol}`}
          width="100%"
          height="100%"
        ></AdvancedRealTimeChart>
      </div>

      
      <div className={Class.orderBook}>
        <SideOrderBook symbol={symbol}></SideOrderBook>
      </div>
    </div>
  );
}
    
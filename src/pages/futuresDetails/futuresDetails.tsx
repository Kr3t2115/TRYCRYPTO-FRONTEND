import { useParams } from "react-router-dom";
import SideCryptoPrice from "./components/sideCryptoPrice/sideCryptoPrice";
import Class from "./futuresDetails.module.css";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FuturesDetail() {
  let { symbol } = useParams();

  const navigation = useNavigate();

  useEffect(() => {
    if (!symbol) {
      navigation("/");
    }
  }, []);

  return (
    <>
      <div className={Class.mainGrid}>
        <div className={Class.buycrypto}>
          <SideCryptoPrice symbol={symbol}></SideCryptoPrice>
        </div>
        <div className={Class.chart}>
          <AdvancedRealTimeChart
            timezone="Europe/Berlin"
            theme="dark"
            symbol={`BINANCE:${symbol}.P`}
            width="100%"
            height="100%"
          ></AdvancedRealTimeChart>
        </div>
      </div>
    </>
  );
}

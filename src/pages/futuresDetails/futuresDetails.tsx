import { useParams } from "react-router-dom";
import SideCryptoPrice from "./components/sideCryptoPrice";
import Class from "./futuresDetails.module.css";

export default function FuturesDetail() {
  let { symbol } = useParams();

  return (
    <>
    <h1>Futures {symbol}</h1>
<div className={Class.mainGrid}>
        <div className={Class.buycrypto}>
            <SideCryptoPrice symbol={symbol}></SideCryptoPrice>
        </div>
    </div>

</>
  );
}

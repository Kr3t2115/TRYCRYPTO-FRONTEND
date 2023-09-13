import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import Class from "./sideOrderBook.module.css";

export default function SideOrderBook({
  symbol,
}: {
  symbol: string | undefined;
}) {
  const [bids, setBids] = useState([]);

  const [asks, setAsks] = useState([]);

  const wsLink =
    import.meta.env.VITE_WS_BINANCE_URL + symbol?.toLowerCase() + "@depth20";

  const { sendJsonMessage, lastJsonMessage }: any = useWebSocket(
    import.meta.env.VITE_WS_BINANCE_URL + symbol?.toLowerCase() + "@depth20"
  );

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setAsks(lastJsonMessage?.asks);

      setBids(lastJsonMessage?.bids);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    console.log(asks);
  }, [asks]);

  return (
    <div>
      <h1>{symbol} bids and asks</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 20px",
        }}
      >
        <div className={Class.asks}>
          <h1>Asks</h1>
          {asks &&
            asks.map((e): any => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <span>{parseFloat(e[0]).toFixed(2)}</span>
                  <span>{parseFloat(e[1]).toFixed(2)}</span>
                </div>
              );
            })}
        </div>
        <div className={Class.bids}>
          <h1>Bids</h1>

          {bids &&
            bids.map((e): any => {
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <span>{parseFloat(e[0]).toFixed(2)}</span>
                  <span>{parseFloat(e[1]).toFixed(2)}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

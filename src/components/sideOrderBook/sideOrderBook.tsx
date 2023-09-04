import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import Class from './sideOrderBook.module.css';

export default function SideOrderBook(props: any) {

    let { symbol }= props;

    const [bids, setBids] = useState([]);

    const [asks, setAsks] = useState([]);
  
    const wsLink =
      import.meta.env.VITE_WS_BINANCE_URL + symbol?.toLowerCase() + "@depth20";
  
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(import.meta.env.VITE_WS_BINANCE_URL + symbol?.toLowerCase() + "@depth20");
  
  
    useEffect(() => {
      if (lastJsonMessage !== null) {
        setAsks(lastJsonMessage?.asks);
  
        setBids(lastJsonMessage?.bids);
      }
    }, [lastJsonMessage]);

    return (
    

            <div>
                  <h1>{symbol} bids and asks</h1>
              <div className={Class.asks}></div>
              <div className={Class.bids}></div>
            </div>

)
}
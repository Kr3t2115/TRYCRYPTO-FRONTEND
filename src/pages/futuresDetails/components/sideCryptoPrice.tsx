import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Class from "./sideCryptoPrice.module.css";
import useWebSocket from "react-use-websocket";

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

  
export default function SideCryptoPrice({symbol}: any) {
 
    const [show, setShow] = useState<boolean>(false);

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

      
    let indexOfName = symbol?.search("USDT");

    let imageName = symbol?.slice(0, indexOfName).toLowerCase();
  
    let imageLink = import.meta.env.VITE_API_URL + "/icon/" + imageName;
  
    let lower = symbol.toLowerCase();

    
    const handleShow = () => {
      setShow(true);
    }
    
    const { lastJsonMessage , lastMessage } = useWebSocket<any>(
      `wss://fstream.binance.com/ws/${lower}@ticker`
    );
    
    useEffect(() => {
      console.log(lastMessage)
    }, [lastMessage])

    useEffect(() => {
      console.log(lastJsonMessage)
    }, [lastJsonMessage])

    return(
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

        <Button onClick={handleShow} className={Class.button}>
          Buy/Sell {symbol}
        </Button>
        </div>
    )
}
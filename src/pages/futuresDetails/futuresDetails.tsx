import { useParams } from "react-router-dom";

export default function FuturesDetail() {
    let { symbol } = useParams();

return <div>
        <h1>Futures {symbol}</h1>
    </div>
}
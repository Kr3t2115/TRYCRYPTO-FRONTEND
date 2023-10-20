import axios from "axios";

export default async function getPositionsByPair(pair: string) {
    
    const res = await axios.get("https://api.trycrypto.pl/api/positions/futures/" + pair,  {withCredentials: true});

    return res.data;   
}
import { Link } from "react-router-dom";
import classes from "./table.module.css";
import { useEffect } from "react";

export default function TableBody({ data, limit, instrument }: any) {
  if (limit) {
    data = data.slice(0, 5);
  }

  useEffect(() => {
    console.log(data)
  }, [])

  return (
    <tbody>
      {data.map((crypto: any) => {
        let percentChange;

        let calc = Math.round(parseFloat(crypto.percentChange) * 100) / 100;
        if (crypto.percentChange.includes("-")) {
          percentChange = (
            <td className={classes.tableDataCenter + " text-danger"}>
              {calc}
              {"%"}
            </td>
          );
        } else {
          percentChange = (
            <td className={classes.tableDataCenter + " text-success"}>
              {calc}
              {"%"}
            </td>
          );
        }

        return (
          <TableRow
            cryptoData={crypto}
            percentChange={percentChange}
            instrument={instrument}
            key={data.name}
          ></TableRow>
        );
      })}
    </tbody>
  );
}

const TableRow = ({ cryptoData, percentChange, instrument }: any) => {
  let indexOfName = cryptoData.name.search("USDT");

  let imageName = cryptoData.name.slice(0, indexOfName).toLowerCase();

  let imageLink = import.meta.env.VITE_API_URL + "/icon/" + imageName;

  let newInstrument = instrument?.toLowerCase();

  return (
    <Link
      to={`/markets/${newInstrument}/` + cryptoData.name}
      className={classes.hrefs}
    >
      <tr
        className={classes.table + " " + classes.tableBodyTr}
        key={cryptoData.name}
      >
        <td className={classes.cryptoName}>
          <div className={classes.name}>
            <img src={imageLink} alt={imageName + " logo"}></img>
            {cryptoData.name}
          </div>
        </td>

        <td className={classes.tableDataCenter}>
          {parseFloat(cryptoData.lastPrice)}$
        </td>

        <td className={classes.tableDataCenter}>
          {parseFloat(cryptoData.openPrice)}$
        </td>

        <td className={classes.tableDataCenter}>
          {parseFloat(cryptoData.highPrice)}$
        </td>

        {percentChange}
      </tr>
    </Link>
  );
};

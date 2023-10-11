import classes from "./table.module.css";

export default function TableHeader() {
  return (
    <thead>
      <tr className={classes.table}>
        <th title="Name of the cryptocurrency" className={classes.cryptoNameTh}>
          Name
        </th>
        <th title="Closing crypto price in last 24 hours">Last Price</th>
        <th title="Price as it was 24 hours ago">Open Price</th>
        <th title="Highest crypto price in last 24 hours">High Price</th>
        <th title="Relative price change in percent in last 24 hours">
          Change 24h
        </th>
      </tr>
    </thead>
  );
}

import { useEffect, useState } from "react";
import classes from "./table.module.css";
import TableBody from "./tableBody";
import TableHeader from "./tableHeader";
import Loader from "../../components/loader/loader";

interface tableInterface {
  spotData: any;
  futuresData: any;
  limit?: boolean;
}

interface instrument {
  name: "Spot" | "Futures";
}

export default function Table({
  spotData,
  futuresData,
  limit,
}: tableInterface) 
{
  const [instrument, setInstrument] = useState<instrument>({ name: "Spot" });

  const [currentData , setCurrentData] = useState([]);

  const [loader , setLoader ] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Home Page";
  }, []);

  spotData.sort((a: any, b: any) => {
    return parseFloat(b.volume) - parseFloat(a.volume);
  });

  futuresData.sort((a: any, b: any) => {
    return parseFloat(b.volume) - parseFloat(a.volume);
  });

  useEffect(() => {

    if(instrument.name == "Spot") {
      setCurrentData(spotData)
    }
    
    setLoader(false)

  }, [spotData])


  useEffect(() => {
    if(instrument.name == "Futures") {
      setCurrentData(futuresData)
    }
    setLoader(false)

  }, [futuresData])


  return (
    <div>
        <Loader isOpen={loader}></Loader>

      <div className="container">
      
      <div className={classes.mainCont}>
        <div className={classes.instrument}>
          <div className={classes.instrumentButtonCont}>
            <button
              className={classes.instrumentButton + " "+ (instrument.name == "Spot" ? classes.buttonActive : " ")}
              onClick={() => {
                setInstrument({ name: "Spot" });
                setLoader(true);
              }}
            >
              Spot
            </button>

            <button
              className={classes.instrumentButton + " "+ (instrument.name == "Futures" ? classes.buttonActive : " ")}
              onClick={() => {
                setInstrument({ name: "Futures" });
                setLoader(true);
              }}
            >
              Futures
            </button>
          </div>

          <div className={classes.instrumentTitle}>Used instrument is: {instrument.name}</div>
        </div>

        <div className={classes.tableContainer}>
          <table className="table">
            <TableHeader></TableHeader>
            <TableBody
              data={currentData}
              limit={limit}
              instrument={instrument.name}
            ></TableBody>
          </table>
        </div>
      </div>
    </div>

    </div>

  );
}

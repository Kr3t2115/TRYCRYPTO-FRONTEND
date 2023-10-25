import { useEffect, useState } from "react";
import classes from "./table.module.css";
import TableBody from "./tableBody";
import TableHeader from "./tableHeader";
import Loader from "../../../../components/loader/loader";
import { createSearchParams } from "react-router-dom";

interface tableInterface {
  spotData: any;
  futuresData: any;
  limit?: boolean;
  instrumentMain: any;
  setInstrumentMain: any;
}

export default function Table({
  spotData,
  futuresData,
  limit,
  instrumentMain,
  setInstrumentMain,
}: tableInterface) {
  const [currentData, setCurrentData] = useState([]);

  const [loader, setLoader] = useState<boolean>(false);

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
    if (instrumentMain.get("name") == "Spot") {
      setCurrentData(spotData);
    }

    setLoader(false);
  }, [spotData]);

  useEffect(() => {
    if (instrumentMain.get("name") == "Futures") {
      setCurrentData(futuresData);
    }
    setLoader(false);
  }, [futuresData]);

  useEffect(() => {
    if (instrumentMain.get("name") === null) {
      instrumentMain.set("name", "Spot");
    }
  }, []);

  useEffect(() => {}, [instrumentMain]);

  return (
    <div>
      <Loader isOpen={loader}></Loader>
      <div className="container">
        <div className={classes.mainCont}>
          <div className={classes.instrument}>
            <div className={classes.instrumentButtonCont}>
              <button
                className={
                  classes.instrumentButton +
                  " " +
                  (instrumentMain.get("name") == "Spot"
                    ? classes.buttonActive
                    : " ")
                }
                onClick={() => {
                  setInstrumentMain(createSearchParams({ name: "Spot" }));
                  setLoader(true);
                }}
              >
                Spot
              </button>

              <button
                className={
                  classes.instrumentButton +
                  " " +
                  (instrumentMain.get("name") == "Futures"
                    ? classes.buttonActive
                    : " ")
                }
                onClick={() => {
                  setInstrumentMain(createSearchParams({ name: "Futures" }));
                  setLoader(true);
                }}
              >
                Futures
              </button>
            </div>

            <div className={classes.instrumentTitle}>
              Used instrument is: {instrumentMain.get("name")}
            </div>
          </div>
          <div className={classes.tableContainer}>
            <table className="table">
              <TableHeader></TableHeader>
              <TableBody
                data={currentData}
                limit={limit}
                instrument={instrumentMain.get("name")}
              ></TableBody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Header from "../../components/header/header";
import PercentChange from "../../components/percentChange/percentChange";
import Table from "../../components/table/table";
import SectionHeader from "../../components/sectionHeader/sectionHeader";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Footer from "../../components/footer/footer";

export default function Home(props: any) {
  const [spotData, setSpotData] = useState([]);

  const [futuresData, setFuturesData] = useState([]);

  const { lastJsonMessage } : any = useWebSocket(
    import.meta.env.VITE_WS_URL
  );

  useEffect(() => {
    setFuturesData([]);

    setSpotData([]);

    if (lastJsonMessage !== null) {
      const spotMap = new Map(Object.entries(lastJsonMessage?.spot));

      spotMap.forEach((value: any, index) => {
        value.name = index;

        setSpotData((oldArray): any => [...oldArray, value]);
      });
      const futuresMap = new Map(Object.entries(lastJsonMessage?.futures));

      futuresMap.forEach((value: any, index) => {
        value.name = index;

        setFuturesData((oldArray): any => [...oldArray, value]);
      });
    }
  }, [lastJsonMessage]);

  return (
    <div>
      <Header></Header>
      <SectionHeader text="Popular crypto"></SectionHeader>
      <Table spotData={spotData} futuresData={futuresData}  limit={true}></Table>
      <SectionHeader></SectionHeader>
      <PercentChange spotData={spotData}></PercentChange>
      <Footer></Footer>
    </div>
  );
}

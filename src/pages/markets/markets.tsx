import Table from "../../components/table/table";
import SectionHeader from "../../components/sectionHeader/sectionHeader";
import useWebSocket from 'react-use-websocket';
import { useState, useEffect } from "react";

export default function Markets() {

  document.title = "Markets";

  const [spotData, setSpotData] = useState([])

  const [futuresData, setFuturesData] = useState([])

	const { lastJsonMessage } : any = useWebSocket(
		import.meta.env.VITE_WS_URL,
	);

  useEffect(() => {

    setFuturesData([])

    setSpotData([])

    if(lastJsonMessage !== null) {

          const spotMap = new Map(Object.entries(lastJsonMessage?.spot))

          spotMap.forEach((value: any, index) => {

            value.name = index

            setSpotData((oldArray): any => [...oldArray, value]);
          })  
          const futuresMap = new Map(Object.entries(lastJsonMessage?.futures))

          futuresMap.forEach((value : any , index) => {
            value.name = index

            setFuturesData((oldArray): any => [...oldArray, value]);          })  
    }
  }, [lastJsonMessage]);
  

  return (
    <div>
      <SectionHeader text="All crypto"></SectionHeader>
      <Table futuresData={futuresData} spotData={spotData}></Table>
    </div>
  );
}

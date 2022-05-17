import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { graphDataType } from "../../type";
import { NextPage } from "next";
const OhlcChart = dynamic<any>(
  () => import("../../components/Graph/OhlcChart"),
  { ssr: false }
);

const index: NextPage = () => {
  const [graphData, setGraphData] = useState<graphDataType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchData("1h", 1000);
  }, []);
  const dataFunc = (date: string) => {
    let timeFrame: string;
    let limit: number;
    if (date === "7d") {
      timeFrame = "1h";
      limit = 1200;
    }
    if (date === "3d") {
      timeFrame = "1h";
      limit = 1200;
    }
    if (date === "6h") {
      timeFrame = "30m";
      limit = 1000;
    }
    if (timeFrame != undefined && limit != undefined) {
      fetchData(timeFrame, limit);
    }
  };
  const fetchData = async (timeFrame: string, limit: number) => {
    setLoading(true);
    const response = await axios.get(
      `https://api-pub.bitfinex.com/v2/candles/trade:${timeFrame}:tBTCUSD/hist?limit=${limit}`
    );
    if (response.data) {
      const data: graphDataType[] = response.data.map((item: any) => {
        return {
          Date: item[0],
          Open: item[1],
          Close: item[2],
          High: item[3],
          Low: item[4],
          Volume: item[5],
        };
      });
      setGraphData(data);
    }
    setLoading(false);
  };
  if (loading) {
    return <div>Loading....</div>;
  }
  if (!graphData) {
    return <div>Loading....</div>;
  }
  return (
    <Fragment>
      <OhlcChart graphData={graphData} graphFunc={dataFunc} />
    </Fragment>
  );
};

export default index;

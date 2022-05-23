import React, { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { OhlcData } from "../../type";
import { NextPage } from "next";
import { getOhlcData } from "../../api/api-routes";
const OhlcChart = dynamic<any>(
  () => import("../../components/Graph/OhlcChart"),
  { ssr: false }
);

enum InitialTimePeriod {
  TimeFrame = "1h",
  Limit = 288,
}
enum TimePeriod {
  Month1 = "1m",
  Day7 = "7d",
  Day3 = "3d",
  Hour6 = "6h",
  TimeFrameMonth1 = "1h",
  LimitMonth1 = 740,
  TimeFrameDay7 = "30m",
  LimitDay7 = 270,
  TimeFrameDay3 = "15m",
  LimitDay3 = 220,
  TimeFrameHour6 = "1m",
  LimitHour6 = 200,
}
const index: NextPage = () => {
  const [graphData, setGraphData] = useState<OhlcData[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchOhlcData(InitialTimePeriod.TimeFrame, InitialTimePeriod.Limit);
  }, []);

  const changeOhlcPeriodHandler = (timePeriod: string) => {
    let timeFrame: string;
    let limit: number;
    if (timePeriod === TimePeriod.Month1) {
      timeFrame = TimePeriod.TimeFrameMonth1;
      limit = TimePeriod.LimitMonth1;
    }
    if (timePeriod === TimePeriod.Day7) {
      timeFrame = TimePeriod.TimeFrameDay7;
      limit = TimePeriod.LimitDay7;
    }
    if (timePeriod === TimePeriod.Day3) {
      timeFrame = TimePeriod.TimeFrameDay3;
      limit = TimePeriod.LimitDay3;
    }
    if (timePeriod === TimePeriod.Hour6) {
      timeFrame = TimePeriod.TimeFrameHour6;
      limit = TimePeriod.LimitHour6;
    }
    if (timeFrame != undefined && limit != undefined) {
      fetchOhlcData(timeFrame, limit);
    }
  };
  const fetchOhlcData = async (timeFrame: string, limit: number) => {
    setLoading(true);
    const response = await getOhlcData(timeFrame, limit);
    if (response.data) {
      const data: OhlcData[] = response.data.map((item: any) => {
        enum OhlcChart {
          DateValue = item[0],
          OpenValue = item[1],
          CloseValue = item[2],
          HighValue = item[3],
          LowValue = item[4],
          VolumeValue = item[5],
        } 
        return {
          Date: OhlcChart.DateValue,
          Open: OhlcChart.OpenValue,
          Close: OhlcChart.CloseValue,
          High: OhlcChart.HighValue,
          Low: OhlcChart.LowValue,
          Volume: OhlcChart.VolumeValue,
        };
      });
      setGraphData(data);
    }
    setLoading(false);
  };
  if (loading || !graphData) {
    return (
      <div>
        <OhlcChart graphData={[]} changeOhlcPeriod={changeOhlcPeriodHandler} />
      </div>
    );
  }
  return (
    <Fragment>
      <OhlcChart
        changeOhlcPeriod={changeOhlcPeriodHandler}
        graphData={graphData}
      />
    </Fragment>
  );
};

export default index;

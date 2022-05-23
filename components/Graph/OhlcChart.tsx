import React, { Fragment, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5/index";
import { OhlcData } from "../../type";
import classes from "./OhlcChart.module.css";
import { drawGraph } from "./drawOhlc";
const OhlcChart: React.FC<{
  graphData: OhlcData[];
  changeOhlcPeriod: (text: string) => void;
}> = (props) => {
  useEffect(() => {
    const element: any = document.getElementById("chartcontrols");
    element.addEventListener(
      "click",
      (event: { target: { innerHTML: string } }) => {
        props.changeOhlcPeriod(event.target.innerHTML);
      }
    );
    let root = am5.Root.new("chartdiv");
    drawGraph(root, props.graphData);
    return () => {
      root.dispose();
    };
  }, []);

  return (
    <Fragment>
      <div id="chartcontrols"></div>
      <div
        id="chartdiv"
        className={
          props.graphData.length != 0 ? classes.chart : classes.nopointer
        }
      ></div>
    </Fragment>
  );
};

export default OhlcChart;

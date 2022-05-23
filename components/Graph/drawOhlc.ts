import * as am5 from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5stock from "@amcharts/amcharts5/stock";
import { OhlcData } from "../../type";
export const drawGraph = (root: any, graphData: OhlcData[]) => {
  root.setThemes([am5themes_Animated.new(root)]);

  let stockChart = root.container.children.push(
    am5stock.StockChart.new(root, {})
  );

  root.numberFormatter.set("numberFormat", "#,###.00");

  let mainPanel = stockChart.panels.push(
    am5stock.StockPanel.new(root, {
      wheelY: "zoomX",
      panX: true,
      panY: true,
    })
  );

  let valueAxis = mainPanel.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom",
      }),
      extraMin: 0.1,
      tooltip: am5.Tooltip.new(root, {}),
      numberFormat: "#,###.00",
      extraTooltipPrecision: 2,
    })
  );

  let dateAxis = mainPanel.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "hour",
        count: 8,
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  let valueSeries = mainPanel.series.push(
    am5xy.CandlestickSeries.new(root, {
      name: "MSFT",
      clustered: false,
      valueXField: "Date",
      valueYField: "Close",
      highValueYField: "High",
      lowValueYField: "Low",
      openValueYField: "Open",
      calculateAggregates: true,
      xAxis: dateAxis,
      yAxis: valueAxis,
      legendValueText:
        "open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]",
      legendRangeValueText: "",
    })
  );

  stockChart.set("stockSeries", valueSeries);

  let valueLegend = mainPanel.plotContainer.children.push(
    am5stock.StockLegend.new(root, {
      stockChart: stockChart,
    })
  );

  let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
    inside: true,
  });

  volumeAxisRenderer.labels.template.set("forceHidden", true);
  volumeAxisRenderer.grid.template.set("forceHidden", true);

  let volumeValueAxis = mainPanel.yAxes.push(
    am5xy.ValueAxis.new(root, {
      numberFormat: "#.#a",
      height: am5.percent(20),
      y: am5.percent(100),
      centerY: am5.percent(100),
      renderer: volumeAxisRenderer,
    })
  );

  let volumeSeries = mainPanel.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Volume",
      clustered: false,
      valueXField: "Date",
      valueYField: "Volume",
      xAxis: dateAxis,
      yAxis: volumeValueAxis,
      legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]",
    })
  );

  volumeSeries.columns.template.setAll({
    strokeOpacity: 0,
    fillOpacity: 0.5,
  });

  volumeSeries.columns.template.adapters.add(
    "fill",
    function (fill: any, target: { dataItem: any }) {
      let dataItem = target.dataItem;
      if (dataItem) {
        return stockChart.getVolumeColor(dataItem);
      }
      return fill;
    }
  );

  stockChart.set("volumeSeries", volumeSeries);
  valueLegend.data.setAll([valueSeries, volumeSeries]);

  mainPanel.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      yAxis: valueAxis,
      xAxis: dateAxis,
      snapToSeries: [valueSeries],
      snapToSeriesBy: "y!",
    })
  );

  let scrollbar = mainPanel.set(
    "scrollbarX",
    am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50,
    })
  );
  stockChart.toolsContainer.children.push(scrollbar);

  let sbDateAxis = scrollbar.chart.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: "hour",
        count: 8,
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
    })
  );

  let sbValueAxis = scrollbar.chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  let sbSeries = scrollbar.chart.series.push(
    am5xy.LineSeries.new(root, {
      valueYField: "Close",
      valueXField: "Date",
      xAxis: sbDateAxis,
      yAxis: sbValueAxis,
    })
  );

  sbSeries.fills.template.setAll({
    visible: true,
    fillOpacity: 0.3,
  });

  stockChart.indicators.push(
    am5stock.RelativeStrengthIndex.new(root, {
      stockChart: stockChart,
      stockSeries: valueSeries,
    })
  );

  let periodSelector = am5stock.PeriodSelector.new(root, {
    stockChart: stockChart,
  });

  valueSeries.events.on("datavalidated", function () {
    periodSelector.selectPeriod({ timeUnit: "month", count: 3 });
  });

  let toolbar = am5stock.StockToolbar.new(root, {
    container: document.getElementById("chartcontrols"),
    stockChart: stockChart,
    controls: [
      am5stock.PeriodSelector.new(root, {
        stockChart: stockChart,
        periods: [
          { timeUnit: "month", count: 1, name: "1m" },
          { timeUnit: "day", count: 7, name: "7d" },
          { timeUnit: "day", count: 3, name: "3d" },
          { timeUnit: "hour", count: 6, name: "6h" },
        ],
      }),
    ],
  });
  if (graphData) {
    valueSeries.data.setAll(graphData);
    volumeSeries.data.setAll(graphData);
    sbSeries.data.setAll(graphData);
  }
};

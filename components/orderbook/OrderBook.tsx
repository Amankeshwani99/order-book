import React from "react";
import Table from "./Table";
import { OrderBookData } from "../../type";
import BidsTable from "./BidsTable";
import classes from "./orderbook.module.css";
const asks = "asks";
const bids = "bids";
const OrderBook: React.FC<{ bids: OrderBookData[]; asks: OrderBookData[] }> = (
  props
) => {
  function renderOrders(Component: any, orders: OrderBookData[], type: string) {
    const orderBookDataSlice = orders.slice(0, 15);
    let orderBookSliceSorted: OrderBookData[];
    if (type === asks) {
      orderBookSliceSorted = orderBookDataSlice.sort((asc, desc) => {
        return desc.price - asc.price;
      });
    } else {
      orderBookSliceSorted = orderBookDataSlice.sort((asc, desc) => {
        return asc.price - desc.price;
      });
    }
    return (
      orderBookSliceSorted &&
      orderBookSliceSorted.map((order, index) => {
        return <Component key={index} {...order} />;
      })
    );
  }
  return (
    <div className={classes.orderbook}>
      <table BORDER="2" CELLPADDING="2" CELLSPACING="2" WIDTH="100%">
        <thead>
          <tr>
            <th>Count Value</th>
            <th>Amount Value</th>
            <th>Total Value</th>
            <th>Price Value</th>
          </tr>
        </thead>
        <tbody>{renderOrders(Table, props.bids, bids)}</tbody>
      </table>
      <table BORDER="2" CELLPADDING="2" CELLSPACING="2" WIDTH="100%">
        <thead>
          <tr>
            <th>Price Value</th>
            <th>Total Value</th>
            <th>Amount Value</th>
            <th>Count Value</th>
          </tr>
        </thead>
        <tbody>{renderOrders(BidsTable, props.asks, asks)}</tbody>
      </table>
    </div>
  );
};

export default OrderBook;

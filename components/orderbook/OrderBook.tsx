import React from "react";
import Table from "./Table";
import { OrderBookData } from "../../type";
const OrderBook: React.FC<{ data: OrderBookData[] }> = (props) => {
  function renderOrders(Component: any, orders: OrderBookData[]) {
    const orderBookDataSlice = orders.slice(0, 12);
    return (
      orderBookDataSlice &&
      orderBookDataSlice.map((order, index) => {
        return <Component key={index} {...order} />;
      })
    );
  }
  return (
    <div style={{ marginLeft: "50px" }}>
      <table BORDER="2" CELLPADDING="2" CELLSPACING="2" WIDTH="100%">
        <thead>
          <tr>
            <th>Count Value</th>
            <th>Amount Value</th>
            <th>Total Value</th>
            <th>Price Value</th>
          </tr>
        </thead>
        <tbody>{renderOrders(Table, props.data)}</tbody>
      </table>
    </div>
  );
};

export default OrderBook;

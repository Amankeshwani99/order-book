import { OrderBookData } from "../type";

export const setOrderBookInitialData = (dataItems: number[][]) => {
  const asks: OrderBookData[] = [];
  const bids: OrderBookData[] = [];
  dataItems.forEach(function (item) {
    enum OrderBook {
      price = item[0],
      count = item[1],
      amount = item[2],
    }
    if (OrderBook.count > 0) {
      const amt = ~~OrderBook.amount;
      const orderBookItems = {
        price: OrderBook.price,
        count: OrderBook.count,
        amount: Math.abs(OrderBook.amount),
      };
      if (amt > 0) {
        bids.push(orderBookItems);
      }
      if (amt < 0) {
        asks.push(orderBookItems);
      }
    }
  });
  return [asks, bids];
};

export const setIncomingOrderBookData = (
  dataItems: number[],
  asks: OrderBookData[],
  bids: OrderBookData[]
) => {
  let ask: OrderBookData;
  let bid: OrderBookData;
  let updatedAsks: any = [];
  let updatedBids: any = [];
  const [price, count, amount] = dataItems;
  const amt: number = ~~amount;
  const item: OrderBookData = {
    price,
    count,
    amount: Math.abs(amount),
  };
  if (count > 0) {
    if (amt > 0) {
      bid = item;
    }
    if (amt < 0) {
      ask = item;
    }
  } else if (count == 0) {
    if (amt === 1) {
      const result = bids.filter(function (item: { price: number }) {
        return price !== item.price;
      });
      if (result.length != 0) {
        updatedBids = result;
      }
    } else if (amt === -1) {
      const result = asks.filter(function (item: { price: number }) {
        return price !== item.price;
      });
      if (result.length != 0) {
        updatedAsks = result;
      }
    }
  }
  return [bid, ask, updatedBids, updatedAsks];
};

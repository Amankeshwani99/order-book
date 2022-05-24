import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { OrderBookData } from "../type";
import OrderBook from "../components/orderbook/OrderBook";
import classes from "../styles/table.module.css";
const baseUrl = "wss://api-pub.bitfinex.com/ws/2";
const Home: NextPage = () => {
  const [asks, setAsks] = useState<OrderBookData[]>([]);
  const [bids, setBids] = useState<OrderBookData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getOrderbookData();
  }, []);

  const setOrderBookInitialData = (dataItems: number[][]) => {
    let asks: OrderBookData[] = [];
    let bids: OrderBookData[] = [];
    dataItems.map((item: number[]) => {
      enum OrderBook {
        price = item[0],
        count = item[1],
        amount = item[2],
      }
      if (OrderBook.count > 0) {
        let amt = ~~OrderBook.amount;
        let orderBookItems = {
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
    setAsks(asks);
    setBids(bids);
  };

  const setIncomingOrderBookData = (dataItems: number[]) => {
    const [price, count, amount] = dataItems;
    let amt: number = ~~amount;
    let item: OrderBookData = {
      price,
      count,
      amount: Math.abs(amount),
    };
    if (count > 0) {
      if (amt > 0) {
        setBids((prev) => [item, ...prev]);
      }
      if (amt < 0) {
        setAsks((prev) => [item, ...prev]);
      }
    } else if (count == 0) {
      if (amt === 1) {
        let result = bids.filter(function (item: { price: number }) {
          return price !== item.price;
        });
        if (result.length != 0) {
          setBids(result);
        }
      } else if (amt === -1) {
        let result = asks.filter(function (item: { price: number }) {
          return price !== item.price;
        });
        if (result.length != 0) {
          setAsks(result);
        }
      }
    }
  };
  const getOrderbookData = () => {
    setLoading(true);
    const feed = new WebSocket(baseUrl);
    feed.onopen = () => {
      const subscription = {
        event: "subscribe",
        channel: "book",
        symbol: "tBTCUSD",
        freq: "F0",
        len: 100,
      };
      feed.send(JSON.stringify(subscription));
    };
    feed.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.constructor.name == "Array") {
        const [id, dataItems] = data;
        if (dataItems.length === 3) {
          setIncomingOrderBookData(dataItems);
        } else if (dataItems != "hb" && dataItems.length != 0) {
          setOrderBookInitialData(dataItems);
        }
        setLoading(false);
      }
    };
  };
  if (loading || bids.length == 0 || asks.length == 0) {
    return (
      <div className={classes.loading__container}>
        <div className={classes.loader}></div>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>Order Book App</title>
        <meta name="description" content="order book application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <OrderBook data={bids} />
        <OrderBook data={asks} />
      </div>
    </div>
  );
};

export default Home;

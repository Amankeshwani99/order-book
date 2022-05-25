import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { OrderBookData } from "../type";
import OrderBook from "../components/orderbook/OrderBook";
import classes from "../styles/table.module.css";
import {
  setOrderBookInitialData,
  setIncomingOrderBookData,
} from "../utils/orderBook";
import useWebsockets from "../hooks/use-websocket";

const baseUrl = "wss://api-pub.bitfinex.com/ws/2";
const hb = "hb";
enum booksConfig {
  Event = "subscribe",
  Channel = "book",
  Symbol = "tBTCUSD",
  Freq = "F0",
  Len = 100,
}

const Home: NextPage = () => {
  const [asks, setAsks] = useState<OrderBookData[]>([]);
  const [bids, setBids] = useState<OrderBookData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const data = useWebsockets({ baseUrl, onConnected });

  useEffect(() => {
    getOrderbookData(data);
  }, [data]);

  function onConnected(socket: any) {
    const subscription = {
      event: booksConfig.Event,
      channel: booksConfig.Channel,
      symbol: booksConfig.Symbol,
      freq: booksConfig.Freq,
      len: booksConfig.Len,
    };
    socket.send(JSON.stringify(subscription));
  }

  const getOrderbookData = (orderBook: any) => {
    setLoading(true);
    if (orderBook.length != 0) {
      const [id, dataItems] = orderBook;
      if (dataItems.length === 3) {
        const [bid, ask, updatedAsks, updatedBids] = setIncomingOrderBookData(
          dataItems,
          asks,
          bids
        );
        if (bid) {
          setBids((prev) => [bid, ...prev]);
        }
        if (ask) {
          setAsks((prev) => [ask, ...prev]);
        }
        if (updatedBids.length != 0) {
          setAsks(updatedBids);
        }
        if (updatedAsks.length != 0) {
          setAsks(updatedAsks);
        }
      } else if (dataItems != hb && dataItems.length != 0) {
        const [asks, bids] = setOrderBookInitialData(dataItems);
        setAsks(asks);
        setBids(bids);
      }
      setLoading(false);
    }
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
        }}
      >
        <OrderBook bids={bids} asks={asks} />
      </div>
    </div>
  );
};

export default Home;

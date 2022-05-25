import React, { useState, useEffect, useRef } from "react";

const useWebsocket: React.FC<{
  baseUrl: string;
  onConnected: (socket: any) => void;
}> = ({ baseUrl, onConnected }) => {
  const [data, setData] = useState<number[]>([]);
  const [reconnecting, setReconnecting] = useState<boolean>(false);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = new WebSocket(baseUrl);
    socket.current.onopen = () => {
      console.log("connected");
      onConnected(socket.current);
    };

    socket.current.onclose = () => {
      console.log("closed");
      if (socket.current) {
        if (reconnecting) return;
        setReconnecting(true);
        setTimeout(() => setReconnecting(false), 1000);
      }
    };

    socket.current.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data);
      if (data.constructor.name == "Array") {
        setData(data);
      }
    };

    return () => {
      socket.current.close();
      socket.current = null;
    };
  }, [reconnecting]);

  return data;
};
export default useWebsocket;

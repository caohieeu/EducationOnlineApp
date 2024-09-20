/* eslint-disable no-console */
import { useState, useEffect } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { SERVER_URI } from "@/utils/uri";

type HubParams = {
  userId?: string;
  roomId?: string;
};

const useSignalRConnection = (
  hubName: "roomhub" | "edunimohub",
  params: HubParams,
): HubConnection | null => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (!params.userId && !params.roomId) return;

    const queryParams = new URLSearchParams();

    if (params.userId) queryParams.append("userId", params.userId);
    if (params.roomId) queryParams.append("roomId", params.roomId);

    const newConnection = new HubConnectionBuilder()
      .withUrl(
        `${SERVER_URI}/${hubName}?${queryParams.toString()}`,
      )
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("SignalR Connected");
        setConnection(newConnection);
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [hubName, params.userId, params.roomId]);

  return connection;
};

export default useSignalRConnection;
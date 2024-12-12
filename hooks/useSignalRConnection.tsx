import { useState, useEffect } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";
import { router } from "expo-router";

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
    if (!params.userId) return;

    const queryParams = new URLSearchParams();

    if (params.userId) queryParams.append("userId", params.userId);
    if (params.roomId) queryParams.append("roomId", params.roomId);

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${SERVER_URI}/${hubName}?${queryParams.toString()}`)
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
        connection?.off("roomRequest");
        connection?.off("OnRoomRemoved");
        console.log("SignalR Connection Stopped");
      }
    };
  }, [hubName, params.userId, params.roomId]);

  useEffect(() => {
    if (connection) {
      connection.off("roomRequest");
      
      connection.on("roomRequest", (message) => {
        console.log(message)
          if (message.res) {
              // Toast.show("Vào phòng thành công", {
              //     type: "success",
              //     duration: 1400
              // });
              router.push({
                  pathname: "(routes)/room/stream-room",
                  params: { roomId: message.roomId }
              });
          }
      });

      connection.on("OnRoomRemoved", (message) => {
        console.log(message)
          if (message) {
              // Toast.show("Bạn đã bị kick khỏi phòng", {
              //     type: "warning",
              //     duration: 1400
              // });
              router.push('/')
          }
      });
  }
  return () => {
    connection?.off("roomRequest");
    connection?.off("OnRoomRemoved");
  };
  }, [connection])

  return connection;
};

export default useSignalRConnection;

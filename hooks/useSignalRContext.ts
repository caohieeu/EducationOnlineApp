import { useContext } from "react";
import { HubConnection } from "@microsoft/signalr";
import { SignalRContext } from "@/app/_layout";

export const useSignalRContext = (): HubConnection | null => {
  const context = useContext(SignalRContext);

  if (context === undefined) {
    throw new Error(
      "useSignalRContext must be used within a SignalRContext.Provider",
    );
  }

  return context;
};
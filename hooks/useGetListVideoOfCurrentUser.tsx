"use client";

import { useQuery } from "react-query";
import { axiosInstance } from "@/utils/AxiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint = async (
  query?: string,
): Promise<PaginationResponse<VideoSingle[]>> => {
  const token = await AsyncStorage.getItem("access_token");
  const response = await axiosInstance.get(`/api/Video/GetVideoOfCurrentUser?${query || ""}`, {
    headers: {
      Cookie: token?.toString(), 
    },
  });

  return response.data as PaginationResponse<VideoSingle[]>;
};

const useGetListVideoOfCurrentUser = (query?: string) => {
  return useQuery<PaginationResponse<VideoSingle[]>, Error>(
    ["get-video-current-user", query],
    () => endpoint(query),
    {
      onSuccess: () => {
        console.log("API call get list video of current user successful");
      },
      onError: (error: Error) => {
        console.error("API call failed:", error);
      },
    },
  );
};

export { useGetListVideoOfCurrentUser };
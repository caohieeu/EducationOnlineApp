"use client";

import { useQuery } from "react-query";
import { axiosInstance } from "@/utils/AxiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint = async (
  query?: string,
): Promise<PaginationResponse<VideoSingle[]>> => {
  const token = await AsyncStorage.getItem("access_token");
  const response = await axiosInstance.get(`/api/Video/GetTrendingVideo?${query || ""}`, {
    headers: {
      Cookie: token?.toString(), 
    },
  });

  return response.data as PaginationResponse<VideoSingle[]>;
};

const useGetTrendingVideos = (query?: string) => {
  return useQuery<PaginationResponse<VideoSingle[]>, Error>(
    ["get-trending-video", query],
    () => endpoint(query),
    {
      onSuccess: () => {
        console.log("API call successful");
      },
      onError: (error: Error) => {
        console.error("API trending failed:", error);
      },
    },
  );
};

export { useGetTrendingVideos };
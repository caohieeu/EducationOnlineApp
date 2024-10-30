"use client";

import { useQuery } from "react-query";
import { axiosInstance } from "@/utils/AxiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const endpoint = async (
  query?: string,
): Promise<PaginationResponse<VideoSingle[]>> => {
  const token = await AsyncStorage.getItem("access_token");
  const response = await axiosInstance.get(`/api/Video/GetRecommendVideos?${query || ""}`, {
    headers: {
      Cookie: token?.toString(), 
    },
  });

  return response.data as PaginationResponse<VideoSingle[]>;
};

const useGetRecommendVideos = (query?: string) => {
  return useQuery<PaginationResponse<VideoSingle[]>, Error>(
    ["get-video", query],
    () => endpoint(query),
    {
      onSuccess: () => {
        console.log("API call successful");
      },
      onError: (error: Error) => {
        console.error("API call failed:", error);
      },
    },
  );
};

export { useGetRecommendVideos };
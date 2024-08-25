"use client";

import { useQuery } from "react-query";
import { axiosInstance } from "@/utils/AxiosConfig";

const endpoint = async (
  query?: string,
): Promise<PaginationResponse<VideoSingle[]>> => {
  const response = await axiosInstance.get(`/api/Video?${query || ""}`);

  return response.data as PaginationResponse<VideoSingle[]>;
};

const useGetListVideo = (query?: string) => {
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

export { useGetListVideo };
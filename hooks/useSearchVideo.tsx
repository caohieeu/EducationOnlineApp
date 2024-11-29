"use client";

import { useQuery } from "react-query";
import { axiosInstance } from "@/utils/AxiosConfig";

const endpoint = async (
  query?: string,
  body?: string,
): Promise<PaginationResponse<VideoSingle[]>> => {
  const response = await axiosInstance.get(`/api/Video/SearchVideo?title=${body}&${query || ""}`);

  return response.data as PaginationResponse<VideoSingle[]>;
};

const useSearchVideo = (query?: string, body?: string) => {
  return useQuery<PaginationResponse<VideoSingle[]>, Error>(
    ["get-video-search", query, body],
    () => endpoint(query, body),
    {
      onSuccess: () => {
        console.log("API call get list video successful");
      },
      onError: (error: Error) => {
        console.error("API call failed:", error);
      },
    },
  );
};

export { useSearchVideo };
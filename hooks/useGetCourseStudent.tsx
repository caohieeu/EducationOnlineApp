"use client";

import { useQuery } from "react-query";
import { axiosInstance } from "@/utils/AxiosConfig";

const endpoint = async (
  query?: string,
): Promise<PaginationResponse<Course[]>> => {
  const response = await axiosInstance.get(`/api/Course/GetCourse?${query || ""}`);

  return response.data as PaginationResponse<Course[]>;
};

const useGetCourseStudent = (query?: string) => {
  return useQuery<PaginationResponse<Course[]>, Error>(
    ["get-course-student ", query],
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

export { useGetCourseStudent };
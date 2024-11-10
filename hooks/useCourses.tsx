"use client";

import { useQuery } from "react-query";
import { axiosInstance } from "@/utils/AxiosConfig";

    // const [loading, setLoading] = useState(true);
    // const [courses, setCourses] = useState<Course[]>();
    // const [error, setError] = useState("");

    // useEffect(() => {
    //     const subscription = async () => {
    //         await axios
    //             .get(`${SERVER_URI}/api/Course/GetNewestCourses?page=${page}&pageSize=25`)
    //             .then((res:any) => {
    //                 setCourses(res.data.data);
    //                 setLoading(false);
    //             })
    //             .catch((error:any) => {
    //                 setError(error.message);
    //                 setLoading(false);
    //                 console.log("Error fetch video: " + error);
    //             })
    //     }
    //     subscription();
    // }, [])

    const endpoint = async (
        query?: string,
      ): Promise<PaginationResponse<Course[]>> => {
        const response = await axiosInstance.get(`/api/Course/GetNewestCourses?${query || ""}`);
      
        return response.data as PaginationResponse<Course[]>;
      };
      
      const useCourses = (query?: string) => {
        return useQuery<PaginationResponse<Course[]>, Error>(
          ["get-courses", query],
          () => endpoint(query),
          {
            onSuccess: () => {
              console.log("API call successful");
            },
            onError: (error: Error) => {
              console.error("API get courses failed:", error);
            },
          },
        );
      };
export { useCourses }
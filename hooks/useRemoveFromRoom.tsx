import { axiosInstance } from "@/utils/AxiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { Toast } from "react-native-toast-notifications";
import { useMutation } from "react-query";

const endpoint = async (data: RemoveFromRoomMOdel): Promise<true> => {
  const token = await AsyncStorage.getItem("access_token");
  await axiosInstance.put('/api/Room/RemoveFromRoom', data, {
    headers: {
      Cookie: token?.toString(), 
    },
  });

  return true;
};

const useRemoveFromRoom = () => {
  return useMutation((data: RemoveFromRoomMOdel) => endpoint(data), {
    onSuccess: () => {
      console.log("Success")
    },
    onError: (e: AxiosError) => {
      console.log(e)
    },
  });
};

export { useRemoveFromRoom };

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const token = async () => {
    const tokenString = await AsyncStorage.getItem("access_token");
    return tokenString;
}

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://cms.hightfive.click",
  withCredentials: true,
})

export { axiosInstance }
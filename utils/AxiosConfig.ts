import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://10.0.2.2:80",
  // baseURL: "https://api.hightfive.click",
  withCredentials: true,
})

export { axiosInstance }
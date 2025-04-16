import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8080/api"
      : "/api",
  // baseURL: "http://localhost:8080/api",
  withCredentials: true, // allows sending cookies (JWT stored in cookies)
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

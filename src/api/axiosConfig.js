import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2003/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

export default api;

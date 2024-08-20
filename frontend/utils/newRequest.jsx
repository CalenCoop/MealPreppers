import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost2501:",
  withCredentials: true,
});

export default newRequest;
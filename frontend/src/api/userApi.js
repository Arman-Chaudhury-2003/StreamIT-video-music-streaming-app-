import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:8000/api/v1/users", //backend
  withCredentials: true, // send cookies
});

export default userApi;

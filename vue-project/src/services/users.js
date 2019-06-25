import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "content-type": "application/json"
  }
});

export default {
  getUsers() {
    return userApi.get("/users");
  }
};

import axios from "axios";

export const API = axios.create({
  baseURL: process.env.API_URL || "http://localhost:5500/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

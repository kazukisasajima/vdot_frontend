import axios from "axios";
import { store } from "../store";
import { refreshToken } from "./authAPI";
import { logout } from "../features/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

// リクエスト時に `Authorization` ヘッダーを追加
api.interceptors.request.use(
  async (config) => {
    const state: any = store.getState();
    let token = state.auth.token;
    let refresh = state.auth.refresh;

    if (!token && refresh) {
      try {
        const response = await refreshToken(refresh);
        token = response.data.access;
        localStorage.setItem("access", token);
      } catch (error) {
        store.dispatch(logout());
      }
    }

    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const API = axios.create({
//   baseURL: "http://10.0.2.2:5000/api", 
// });

// API.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const API = axios.create({
  baseURL: "http://10.0.2.2:5000/api",
});

// ✅ cho AuthContext đăng ký hàm logout để API gọi khi 401
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

// ✅ chặn spam alert khi nhiều request cùng lúc
let showingExpiredAlert = false;

API.interceptors.request.use(async (config) => {
  let token = await AsyncStorage.getItem("token");

  // phòng trường hợp token bị lưu kèm "Bearer "
  if (token?.startsWith("Bearer ")) token = token.slice(7);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ bắt 401 (trừ route /auth/* để khỏi phá login sai mật khẩu)
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isAuthRoute = url.includes("/auth/");

    if (status === 401 && !isAuthRoute) {
      if (!showingExpiredAlert) {
        showingExpiredAlert = true;

        // xoá token trước để tránh request tiếp tục dùng token cũ
        await AsyncStorage.removeItem("token");

        Alert.alert(
          "Phiên đăng nhập đã hết hạn",
          "Vui lòng đăng nhập lại.",
          [
            {
              text: "OK",
              onPress: async () => {
                showingExpiredAlert = false;
                // gọi logout từ AuthContext để isLoggedIn=false
                await onUnauthorized?.();
              },
            },
          ],
          { cancelable: false }
        );
      }
    }

    return Promise.reject(error);
  }
);

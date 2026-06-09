import axios from "axios";
import { store } from "@/redux/store";
import { setTokens } from "@/redux/authSlice";

export const refreshToken = async () => {
  try {
    const currentRefreshToken = store.getState().auth.refreshToken;
    if (!currentRefreshToken) {
      return null;
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      {
        refresh: currentRefreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const newAccessToken = data.access || data.accessToken || null;
    const newRefreshToken = data.refresh || data.refreshToken || currentRefreshToken;

    if (newAccessToken) {
      store.dispatch(setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export const handleLogin = async (phone: string, role: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/otp/request/`,
      {
        phone,
        role,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error);
    throw error?.response?.data || error;
  }
};

export const handleLoginOtpVerify = async (
  phone: string,
  code: string,
  role?: string
) => {
  try {
    const payload: any = { phone, code };
    if (role) payload.role = role;

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/otp/verify/`,
      payload
    );

    return response.data;
  } catch (error: any) {
    console.error("OTP Verify Error:", error);
    throw error?.response?.data || error;
  }
};

export const handleLoginWithPassword = async (
  phone: string,
  password: string,
  role?: string,
) => {
  try {
    const payload: any = { phone, password };
    if (role) payload.role = role;

    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login/`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Login with password error:', error);
    throw error?.response?.data || error;
  }
};

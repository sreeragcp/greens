import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
  date_joined?: string;
  [key: string]: unknown;
};

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
};

type LoginPayload = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  accessToken: null,
  refreshToken: null,
  user: null,
};

type SetTokensPayload = {
  accessToken: string;
  refreshToken?: string;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<LoginPayload>) {
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    setTokens(state, action: PayloadAction<SetTokensPayload>) {
      state.token = action.payload.accessToken;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (!state.isAuthenticated) {
        state.isAuthenticated = true;
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { login, logout, setTokens } = authSlice.actions;
export default authSlice.reducer;

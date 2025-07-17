// store/authSlice.js
import { User } from "@/types/event";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;

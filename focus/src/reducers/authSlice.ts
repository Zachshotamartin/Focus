// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  email: string | null;
  name: string | null;
  picture: string | null;

  isAuthenticated: boolean;
}

const initialState: AuthState = {
  email: null,
  name: null,
  picture: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        email: string;
        name: string;
        picture: string;
      }>
    ) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.picture = action.payload.picture;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.email = null;
      state.name = null;
      state.picture = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

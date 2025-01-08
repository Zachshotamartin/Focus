import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  preloadedState: {
    auth: {
      email: null,
      name: null,
      picture: null,
      isAuthenticated: false,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;

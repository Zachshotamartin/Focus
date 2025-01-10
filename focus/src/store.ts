import { configureStore } from "@reduxjs/toolkit";
import eventsSlice from "./reducers/eventsSlice";

const store = configureStore({
  reducer: {
    events: eventsSlice,
  },
  preloadedState: {
    events: { events: [], selectedEvent: null },
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export default store;

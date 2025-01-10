// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EventState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
}

const initialState: EventState = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCalendarEvents: (state, action: PayloadAction<any[]>) => {
      state.events = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addCalendarEvent: (state, action: PayloadAction<any>) => {
      state.events.push(action.payload);
    },
  },
});

export const { setCalendarEvents, addCalendarEvent } = eventsSlice.actions;

export default eventsSlice.reducer;

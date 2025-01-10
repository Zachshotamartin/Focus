// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EventState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedEvent: any | null;
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
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
    removeCalendarEvent: (state) => {
      if (state.selectedEvent !== null) {
        state.events = state.events.filter((event) => event.id !== state.selectedEvent.id);
      }
      state.selectedEvent = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedEvent: (state, action: PayloadAction<any>) => {
      const event = action.payload;
      state.selectedEvent = {
        ...event,
        start: event.start instanceof Date ? event.start.toISOString() : event.start,
        end: event.end instanceof Date ? event.end.toISOString() : event.end,
      };
    },
    
  },
});

export const { setCalendarEvents, addCalendarEvent, removeCalendarEvent, setSelectedEvent } = eventsSlice.actions;

export default eventsSlice.reducer;

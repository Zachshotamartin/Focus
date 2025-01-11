// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EventState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedEvent: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tasks: any[];
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
  tasks: [],
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
        state.events = state.events.filter(
          (event) => event.id !== state.selectedEvent.id
        );
      }
      state.selectedEvent = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedEvent: (state, action: PayloadAction<any>) => {
      const event = action.payload;
      state.selectedEvent = {
        ...event,
        start:
          event.start instanceof Date ? event.start.toISOString() : event.start,
        end: event.end instanceof Date ? event.end.toISOString() : event.end,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setTasks: (state, action: PayloadAction<any[]>) => {
      state.tasks = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addTask: (state, action: PayloadAction<any>) => {
      state.tasks.push(action.payload);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeTask: (state, action: PayloadAction<any>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
    },
  },
});

export const {
  setCalendarEvents,
  addCalendarEvent,
  removeCalendarEvent,
  setSelectedEvent,
  setTasks,
  addTask,
  removeTask,
} = eventsSlice.actions;

export default eventsSlice.reducer;

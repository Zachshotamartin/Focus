import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./calendar.module.css";

import {
  setCalendarEvents,
  setSelectedEvent,
} from "../../reducers/eventsSlice";

const localizer = momentLocalizer(moment);

function GoogleCalendar() {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]); // Use proper typing here for events
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendarEvents = useSelector((state: any) => state.events.events);

  useEffect(() => {
    console.log("calendarEvents", calendarEvents);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newEvents = calendarEvents.map((event: any) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay,
    }));
    setEvents(newEvents);
  }, [calendarEvents]);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      const token = localStorage.getItem("user_token");

      if (token) {
        try {
          const response = await fetch(
            `http://localhost:8080/calendar?token=${token}`
          );
          const data = await response.json();

          if (data.items) {
            // Map the events to the format required by react-big-calendar
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedEvents = data.items.map((event: any) => ({
              id: event.id,
              title: event.summary,
              start: event.start.dateTime || event.start.date, // Keep as a string
              end: event.end.dateTime || event.end.date,
              allDay: !event.start.dateTime,
            }));
            dispatch(setCalendarEvents(mappedEvents));
          }
        } catch (error) {
          console.error("Error fetching calendar events:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCalendarEvents();
  }, []); // Empty dependency array means this will run once when the component mounts

  // Handle event selection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = ({ start, end }: any) => {
    const title = window.prompt("New Event name");
    if (title) {
      setEvents((events) => [
        ...events,
        {
          title,
          start,
          end,
          allDay: end.getDate() === start.getDate(),
        },
      ]);
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className={styles.calendar}>
      <Calendar
        className={styles["react-big-calendar"]}
        localizer={localizer}
        events={events}
        onSelectEvent={(event) => {
          dispatch(
            setSelectedEvent({
              ...event,
              start: event.start.toISOString(),
              end: event.end.toISOString(),
            })
          );
          console.log(event);
        }}
        onSelectSlot={handleSelect}
        defaultView="month"
        selectable={true}
        style={{ height: "100%", width: "100%", color: "black" }}
        components={{
          event: ({ event }) => <div>{event.title}</div>,
        }}
      />
    </div>
  );
}

export default GoogleCalendar;

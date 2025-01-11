/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./calendar.module.css";
import Task from "../task/task";
import SwipeableList from "../swipeableList/swipeableList";
import {
  setCalendarEvents,
  setSelectedEvent,
  setTasks,
} from "../../reducers/eventsSlice";

const localizer = momentLocalizer(moment);

function GoogleCalendar() {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]); // Use proper typing here for events
  const [loading, setLoading] = useState(true);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendarEvents = useSelector((state: any) => state.events.events);
  const [pageState, setPageState] = useState("calendar");
  const [allTasks, setAllTasks] = useState(true);
  const tasks = useSelector((state: any) => state.events.tasks);
  const [viewTasks, setViewTasks] = useState<any[]>(tasks);

  useEffect(() => {
    console.log("calendarEvents", calendarEvents);
    console.log("tasks", tasks);
    // Map events for display
    const newEvents = calendarEvents.map((event: any) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay,
    }));
    setEvents(newEvents);
  }, [calendarEvents, tasks]);

  useEffect(() => {
    console.log("tasks", tasks);
    setViewTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      const token = localStorage.getItem("user_token");

      if (token) {
        try {
          const response = await fetch(
            `http://localhost:8080/calendar?token=${token}`
          );
          const data = await response.json();
          console.log("data", data.items);
          if (data.items) {
            // Map the events to the format required by react-big-calendar
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedEvents = data.items.map((event: any) => ({
              id: event.id,
              title: event.summary,
              start: event.start.dateTime || event.start.date, // Keep as a string
              end: event.end.dateTime || event.end.date,
              allDay: !event.start.dateTime,
              description: event.description,
              extendedProperties: event.extendedProperties,
            }));
            dispatch(setCalendarEvents(mappedEvents));
            const newTasks = mappedEvents.filter(
              (event: any) =>
                event.extendedProperties?.private?.deadline &&
                event.extendedProperties?.private?.estimatedDuration
            );

            // Format tasks for the store
            const finalTasks = newTasks.map((task: any) => ({
              id: task.id,
              title: task.title,
              start: task.start,
              end: task.end,
              allDay: task.allDay,
              extendedProperties: task.extendedProperties,
            }));

            dispatch(setTasks(finalTasks));
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

  const handleQuickAdd = async () => {
    if (!naturalLanguageInput.trim()) {
      alert("Please enter a natural language event description.");
      return;
    }

    const token = localStorage.getItem("user_token");

    if (!token) {
      alert("User is not authenticated.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/calendar/quickadd", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: naturalLanguageInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error adding event:",
          errorData.details || errorData.error
        );
        alert("Failed to add event.");
        return;
      }

      const data = await response.json();
      console.log("Quick add response:", data);

      // Add the new event to your events state
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: data.event.id,
          title: data.event.summary,
          start: new Date(data.event.start.dateTime || data.event.start.date),
          end: new Date(data.event.end.dateTime || data.event.end.date),
          allDay: !data.event.start.dateTime,
        },
      ]);

      setNaturalLanguageInput(""); // Clear the input
    } catch (error) {
      console.error("Error adding quick add event:", error);
      alert("Failed to add event.");
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.pageStateButtonContainer}>
        <button onClick={() => setPageState("calendar")}>Calendar</button>
        <button onClick={() => setPageState("tasks")}>Tasks</button>
      </div>
      {pageState === "calendar" && (
        <>
          <div className={styles.quickAdd}>
            <textarea
              className={styles.naturalLanguageInput}
              placeholder="Add event with natural language"
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
            />
            <button className={styles.button} onClick={handleQuickAdd}>
              Submit
            </button>
          </div>

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
        </>
      )}
      {pageState === "tasks" && (
        <div className={styles.tasks}>
          {tasks.length > 0 && (
            <div className={styles.tasksContainer}>
              <div className={styles.pageStateButtonContainer}>
                <button onClick={() => setAllTasks(true)}>
                  {" "}
                  View all tasks
                </button>
                <button onClick={() => setAllTasks(false)}> Swipe </button>
              </div>
              {allTasks && (
                <ul>
                  {viewTasks.map((task: any) => (
                    <Task key={task.id} task={task} />
                  ))}
                </ul>
              )}
              {!allTasks && <SwipeableList />}
            </div>
          )}
          {tasks.length === 0 && <p>No tasks found.</p>}
        </div>
      )}
    </div>
  );
}

export default GoogleCalendar;

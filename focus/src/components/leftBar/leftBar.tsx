import React, { useState } from "react";
import styles from "./leftBar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { removeCalendarEvent, removeTask } from "../../reducers/eventsSlice";

const LeftBar = ({
  onSubmitEvent,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitEvent: (eventDetails: any) => void;
}) => {
  const [eventDetails, setEventDetails] = useState({
    summary: "",
    description: "",
    start: "",
    end: "",
    timeZone: "America/Los_Angeles",
    estimatedDuration: 0, // Added estimatedDuration field
    deadline: "", // Added deadline field
  });

  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedEvent = useSelector((state: any) => state.events.selectedEvent);

  const handleDelete = async () => {
    if (selectedEvent) {
      const token = localStorage.getItem("user_token");
      console.log("Token:", token);
      if (token) {
        try {
          const response = await fetch(
            `http://localhost:8080/calendar/event/${selectedEvent.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            console.log("Event deleted successfully");
            dispatch(removeTask(selectedEvent));
            dispatch(removeCalendarEvent());
          } else {
            console.error("Failed to delete event");
          }
        } catch (error) {
          console.error("Error deleting event:", error);
        }
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({
      ...prev,
      [name]: name === "estimatedDuration" ? parseFloat(value) : value, // Parse duration as float
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedEvent = {
      summary: eventDetails.summary,
      description: eventDetails.description,
      start: {
        dateTime: new Date(eventDetails.start).toISOString(),
        timeZone: eventDetails.timeZone,
      },
      end: {
        dateTime: new Date(eventDetails.end).toISOString(),
        timeZone: eventDetails.timeZone,
      },
      extendedProperties: {
        private: {
          estimatedDuration: eventDetails.estimatedDuration, // Include estimated duration
          deadline: eventDetails.deadline || null, // Include deadline if provided
        },
      },
    };

    onSubmitEvent(formattedEvent); // Call the provided function
    setEventDetails({
      summary: "",
      description: "",
      start: "",
      end: "",
      timeZone: "America/Los_Angeles",
      estimatedDuration: 0,
      deadline: "",
    });
  };

  return (
    <div className={styles.leftBar}>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="summary">Event Title:</label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={eventDetails.summary}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={eventDetails.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="start">Start Time:</label>
          <input
            type="datetime-local"
            id="start"
            name="start"
            value={eventDetails.start}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="end">End Time:</label>
          <input
            type="datetime-local"
            id="end"
            name="end"
            value={eventDetails.end}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="estimatedDuration">Estimated Duration (hours):</label>
          <input
            type="number"
            id="estimatedDuration"
            name="estimatedDuration"
            value={eventDetails.estimatedDuration}
            onChange={handleChange}
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="datetime-local"
            id="deadline"
            name="deadline"
            value={eventDetails.deadline}
            onChange={handleChange}
          />
        </div>
        <button className={styles.button} type="submit">
          Add Event
        </button>
      </form>
      <button className={styles.button} onClick={handleDelete}>
        Delete Event
      </button>
    </div>
  );
};

export default LeftBar;

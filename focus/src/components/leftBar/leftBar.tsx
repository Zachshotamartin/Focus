import React, { useState } from "react";
import styles from "./leftBar.module.css";

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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
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
    };

    onSubmitEvent(formattedEvent); // Call the provided function
    setEventDetails({
      summary: "",
      description: "",
      start: "",
      end: "",
      timeZone: "America/Los_Angeles",
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
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default LeftBar;

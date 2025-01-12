import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SwipeableTaskItem from "../task/SwipeableTaskItem";
import {
  removeCalendarEvent,
  removeTask,
  setSelectedEvent,
} from "../../reducers/eventsSlice";
import styles from "./swipeableList.module.css";

const SwipeableList = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tasks = useSelector((state: any) => state.events.tasks);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const dispatch = useDispatch();
  const [shownTaskIndex, setShownTaskIndex] = useState(0);
  const [viewTasks, setViewTasks] = useState(tasks);

  useEffect(() => {
    setViewTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    dispatch(setSelectedEvent(viewTasks[shownTaskIndex]));
  }, [dispatch, shownTaskIndex, viewTasks]);

  const handleDelete = async () => {
    if (viewTasks[shownTaskIndex]) {
      const token = localStorage.getItem("user_token");
      console.log("Token:", token);
      if (token) {
        try {
          const response = await fetch(
            `http://localhost:8080/calendar/event/${tasks[shownTaskIndex].id}`,
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
            dispatch(removeTask(viewTasks[shownTaskIndex]));
            dispatch(removeCalendarEvent());
            setShownTaskIndex((prev) =>
              prev >= viewTasks.length - 1 ? 0 : prev
            );
          } else {
            console.error("Failed to delete event");
          }
        } catch (error) {
          console.error("Error deleting event:", error);
        }
      }
    }
  };

  const handleRandomNextTask = () => {
    let randomIndex = Math.floor(Math.random() * viewTasks.length);
    while (randomIndex === shownTaskIndex) {
      randomIndex = Math.floor(Math.random() * viewTasks.length);
    }
    setShownTaskIndex(randomIndex);
  };

  return (
    <div className={styles.container}>
      {viewTasks.length > 0 ? (
        <>
          <SwipeableTaskItem task={tasks[shownTaskIndex]} />
          <div className={styles.buttonContainer}>
            <button onClick={handleRandomNextTask}>Next Task</button>
            <button onClick={handleDelete}>Completed Task</button>
          </div>
        </>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default SwipeableList;

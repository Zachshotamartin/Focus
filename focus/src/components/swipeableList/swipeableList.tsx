import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Task from "../task/task";
import {
  removeCalendarEvent,
  removeTask,
  setSelectedEvent,
} from "../../reducers/eventsSlice";

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

  return (
    <div>
      {viewTasks.length > 0 ? (
        <>
          <Task task={tasks[shownTaskIndex]} />
          <button
            onClick={() =>
              setShownTaskIndex((prev) =>
                prev + 1 > viewTasks.length - 1 ? 0 : prev + 1
              )
            }
          >
            Next Task
          </button>
          <button onClick={handleDelete}>Completed Task</button>
        </>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default SwipeableList;

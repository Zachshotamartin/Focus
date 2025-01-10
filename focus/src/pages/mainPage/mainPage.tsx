import GoogleCalendar from "../../components/calendar/calendar";
import Header from "../../components/header/header";
import LeftBar from "../../components/leftBar/leftBar";
import styles from "./mainPage.module.css";
import { useDispatch } from "react-redux";
import { addCalendarEvent } from "../../reducers/eventsSlice";
const MainPage = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventSubmission = async (eventDetails: any) => {
    try {
      const token = localStorage.getItem("user_token"); // Replace with your logic to retrieve the access token
      console.log("Token:", token);
      const requestBody = {
        eventDetails,
      };

      console.log("Request Body:", requestBody); // Log the request body to check
      const response = await fetch("http://localhost:8080/calendar/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Ensure the Authorization header is set properly
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const event = {
          title: eventDetails.summary,
          start: new Date(
            eventDetails.start.dateTime || eventDetails.start.date
          ), // Handle all day vs timed events
          end: new Date(eventDetails.end.dateTime || eventDetails.end.date),
          allDay: !eventDetails.start.dateTime, // All day events don't have a time
        };
        dispatch(addCalendarEvent(event));
        console.log("Event added successfully");
        alert("Event added successfully!");
      } else {
        console.error("Failed to add event");
        alert("Failed to add event");
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("Error submitting event");
    }
  };

  return (
    <div className={styles.mainPage}>
      <div className={styles.topContainer}>
        <Header />
      </div>
      <div className={styles.bottomContainer}>
        <LeftBar onSubmitEvent={handleEventSubmission} />
        <GoogleCalendar />
      </div>
    </div>
  );
};

export default MainPage;

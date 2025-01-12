/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./swipeableTaskItem.module.css";

const SwipeableTaskItem = (props: any) => {
  const task = props.task;

  const title = task.title;
  //const description = task.description;
  const deadline = task.extendedProperties.private.deadline;
  const estimatedDuration = task.extendedProperties.private.estimatedDuration;
  return (
    <div className={styles.taskContainer}>
      <h3 className={styles.taskTitle}>{title}</h3>
      <p className={styles.taskDeadline}>Deadline: {deadline}</p>
      <p className={styles.taskEstimatedDuration}>
        Estimated Duration: {estimatedDuration}
      </p>
    </div>
  );
};

export default SwipeableTaskItem;

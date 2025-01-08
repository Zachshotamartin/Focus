import Login from "../../components/login/login";
import styles from "./landingPage.module.css";
const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <h1 className={styles.title}>Please Focus</h1>
      <Login />
    </div>
  );
};

export default LandingPage;

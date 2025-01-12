import Login from "../../components/login/login";
import styles from "./loginPage.module.css";
import logo from "../../assets/logo.png";
const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <div className={styles.titleContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>please... Focus</h1>
      </div>
      <Login />
    </div>
  );
};

export default LoginPage;

import styles from "./header.module.css";
import Logout from "../logout/logout";

const Header = () => {
  const userData = JSON.parse(localStorage.getItem("user_info") || "{}");
  console.log("userData", userData);
  console.log("userData.email", userData.email);
  console.log("userData.picture", userData.picture);

  return (
    <div className={styles.header}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Focus</h1>
      </div>
      <Logout />
      <div>
        <p className={styles.email}>Logged in as:</p>
        {userData && userData.email ? (
          <>
            <p className={styles.email}>Welcome, {userData.email}!</p>
            {userData.picture && (
              <img
                src={userData.picture}
                alt="User Profile"
                className={styles.profileImage}
              />
            )}
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default Header;

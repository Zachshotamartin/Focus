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
      <div className={styles.profileContainer}>
        {userData && userData.email ? (
          <>
            {userData.picture && (
              <img
                src={userData.picture}
                alt="User Profile"
                className={styles.profileImage}
              />
            )}
            <p className={styles.email}>{userData.email}!</p>
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default Header;

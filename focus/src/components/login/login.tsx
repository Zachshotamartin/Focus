const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/login"; // Redirect to backend for OAuth
  };

  return (
    <button onClick={handleLogin} style={styles.button}>
      Login with Google
    </button>
  );
};

// Add some basic styling for the button
const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Login;

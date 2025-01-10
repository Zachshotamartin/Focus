import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (token) {
        // Save the token in localStorage for later use
        localStorage.setItem("user_token", token);

        // Redirect the user to the main page after saving the token
        navigate("/main");
      } else {
        console.error("No token found in the URL");
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

export default AuthCallback;

import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode as named import
import axios from "axios";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { login } from "../../reducers/authSlice";

const clientId =
  "437785448020-e5s0spk44tuhlc21pidke746p7br17p1.apps.googleusercontent.com";

const Login = () => {
  const dispatch = useDispatch();

  const onSuccess = async (response: CredentialResponse) => {
    console.log("Login Success");

    const token = response.credential as string;
    const decodedToken: { email: string; name: string; picture: string } =
      jwtDecode(token);
    const email = decodedToken.email;
    const name = decodedToken.name;
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];
    const picture = decodedToken.picture;
    dispatch(
      login({
        email,
        name,
        picture,
      })
    );
    try {
      const res = await axios.post("/api/users", {
        email,
        first_name: firstName,
        last_name: lastName,
      });
      console.log("hey");
      console.log(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      console.log(error.response.data); // Log the error response data
      console.log(error.response.status); // Log the error response status
      console.log(error.response.headers); // Log the error response headers
    }
  };
  const onFailure = () => {
    console.log("Login failed");
  };
  return (
    <div id="signInButton">
      <GoogleOAuthProvider clientId={clientId}>
        <div id="signInButton">
          <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;

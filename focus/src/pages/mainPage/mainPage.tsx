import { useSelector } from "react-redux";
const MainPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useSelector((state: any) => state.auth);
  return (
    <div>
      <h1>Main Page</h1>
      <p>Logged in as {auth.name}</p>
      <p>Email: {auth.email}</p>
      <img src={auth?.picture ?? ""} alt="Profile" />
    </div>
  );
};

export default MainPage;

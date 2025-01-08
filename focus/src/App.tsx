import "./App.css";

import { useSelector } from "react-redux";

import LandingPage from "./pages/landingPage/landingPage";
import MainPage from "./pages/mainPage/mainPage";
function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useSelector((state: any) => state.auth);

  return (
    <div className="App">
      <main>
        {!auth.isAuthenticated && <LandingPage />}
        {auth.isAuthenticated && <MainPage />}
      </main>
    </div>
  );
}

export default App;

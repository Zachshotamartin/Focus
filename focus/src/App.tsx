import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import MainPage from "./pages/mainPage/mainPage";
import AuthCallback from "./authCallback"; // New component
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Main page after successful login */}
        <Route path="/main" element={<MainPage />} />

        {/* OAuth callback route for handling the token */}
        <Route path="/auth" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

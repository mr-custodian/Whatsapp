import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MainPage from "./pages/MainPage";
import PersonalPage from "./pages/PersonalPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mainpage/:user_id" element={<MainPage />} />
        <Route path= "/personalpage/:user_id/:connection_id" element={<PersonalPage />} />
      </Routes>
    </Router>
  );
}

export default App;

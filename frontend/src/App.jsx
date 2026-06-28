import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileForm from "./ProfileForm";
import MyProfileDashboard from "./pages/MyProfileDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfileForm />} />
        <Route
          path="/dashboard"
          element={<MyProfileDashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
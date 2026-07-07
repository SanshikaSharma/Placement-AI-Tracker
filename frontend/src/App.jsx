import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProfileForm from "./ProfileForm";
import Login from "./Login";
import MyProfileDashboard from "./pages/MyProfileDashboard";
import PlacementDashboard from "./pages/PlacementDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ProfileForm />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<MyProfileDashboard />}
        />

        <Route
          path="/placements"
          element={<PlacementDashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
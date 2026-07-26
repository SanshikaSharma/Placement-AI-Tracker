import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProfileForm from "./ProfileForm";
import Login from "./Login";
import MyProfileDashboard from "./pages/MyProfileDashboard";
import PlacementDashboard from "./pages/PlacementDashboard";
import CompanyList from "./pages/CompanyList";
import ApplicationTracker from "./pages/ApplicationTracker";
import ApplicationAnalytics from "./pages/ApplicationAnalytics";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Landing from "./pages/Landing/Landing";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import ResumePage from "./pages/Resume/ResumePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<ProfileForm />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
       <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Layout>
        <MyProfileDashboard />
      </Layout>
    </ProtectedRoute>
  }
/>

        {/* Placement Dashboard */}
        <Route
  path="/placements"
  element={
    <ProtectedRoute>
      <Layout>
        <PlacementDashboard />
      </Layout>
    </ProtectedRoute>
  }
/>

        {/* Companies */}
        <Route
  path="/companies"
  element={
    <ProtectedRoute>
      <Layout>
        <CompanyList />
      </Layout>
    </ProtectedRoute>
  }
/>

        {/* Applications */}
      <Route
  path="/applications"
  element={
    <ProtectedRoute>
      <Layout>
        <ApplicationTracker />
      </Layout>
    </ProtectedRoute>
  }
/>
        {/* Analytics */}
       <Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <Layout>
        <ApplicationAnalytics />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route path="/landing" element={<Landing />} />
<Route path="/dashboard-v2" element={<DashboardHome />} />
<Route
  path="/resume"
  element={
    <ProtectedRoute>
      <Layout>
        <ResumePage />
      </Layout>
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProfileForm from "./ProfileForm";
// Dashboard Pages
import DashboardHome from "./pages/Dashboard/DashboardHome";
import MyProfileDashboard from "./pages/Dashboard/MyProfileDashboard";
import PlacementDashboard from "./pages/Dashboard/PlacementDashboard";

// Other Pages
import CompanyList from "./pages/Companies/CompanyList";
import ApplicationTracker from "./pages/Applications/ApplicationTracker";
import ApplicationAnalytics from "./pages/Analytics/ApplicationAnalytics";
import ResumePage from "./pages/Resume/ResumePage";
import ResumeAnalysis from "./pages/AI/ResumeAnalysis";
import AddCompany from "./pages/Companies/AddCompany";
import EditCompany from "./pages/Companies/EditCompany";
import MyApplications from "./pages/Applications/MyApplications";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// Components
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/profile-form" element={<ProfileForm />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardHome />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <MyProfileDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

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
<Route
  path="/resume-analysis"
  element={
    <ProtectedRoute>
      <Layout>
        <ResumeAnalysis />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/companies/add"
  element={
    <ProtectedRoute>
      <Layout>
        <AddCompany />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/companies/edit/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <EditCompany />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/my-applications"
  element={
    <ProtectedRoute>
      <Layout>
        <MyApplications />
      </Layout>
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
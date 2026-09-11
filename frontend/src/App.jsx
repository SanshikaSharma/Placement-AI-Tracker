import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import AdminLayout from "./components/admin/AdminLayout";

// =========================
// Public Pages
// =========================
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProfileForm from "./ProfileForm";

// =========================
// Student Dashboard Pages
// =========================
import DashboardHome from "./pages/Dashboard/DashboardHome";
import MyProfileDashboard from "./pages/Dashboard/MyProfileDashboard";
import PlacementDashboard from "./pages/Dashboard/PlacementDashboard";

// =========================
// Student Pages
// =========================
import CompanyList from "./pages/Companies/CompanyList";
import CompanyDetails from "./pages/Companies/CompanyDetails";

import ApplicationTracker from "./pages/Applications/ApplicationTracker";
import MyApplications from "./pages/Applications/MyApplications";

import ApplicationAnalytics from "./pages/Analytics/ApplicationAnalytics";

import ResumePage from "./pages/Resume/ResumePage";
import ResumeAnalysis from "./pages/AI/ResumeAnalysis";

import Recommendations from "./pages/Recommendations/Recommendations";
import NotificationsPage from "./pages/Notifications/NotificationsPage";

import AIInterviewPage from "./pages/AIInterview/AIInterviewPage";
import CareerAnalyticsPage from "./pages/CareerAnalytics/CareerAnalyticsPage";

// =========================
// Admin Pages
// =========================
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageCompanies from "./pages/Admin/ManageCompanies";
import AdminStudents from "./pages/Admin/AdminStudents";
import AdminApplications from "./pages/Admin/AdminApplications";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminStudentDetails from "./pages/Admin/AdminStudentDetails";

// =========================
// Protection
// =========================
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================
// Layout
// =========================
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Router>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/profile-form"
          element={<ProfileForm />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/students"
              element={<AdminStudents />}
            />

            <Route
              path="/admin/students/:id"
              element={<AdminStudentDetails />}
            />

            <Route
              path="/admin/companies"
              element={<ManageCompanies />}
            />

            <Route
              path="/admin/applications"
              element={<AdminApplications />}
            />

            <Route
              path="/admin/analytics"
              element={<AdminAnalytics />}
            />

          </Route>
        </Route>


        {/* =========================
            STUDENT DASHBOARD
        ========================= */}

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


        {/* =========================
            PROFILE
        ========================= */}

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


        {/* =========================
            PLACEMENTS
        ========================= */}

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


        {/* =========================
            STUDENT COMPANIES
            VIEW + APPLY ONLY
        ========================= */}

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
          path="/company/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CompanyDetails />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            APPLICATIONS
        ========================= */}

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
          path="/my-applications"
          element={
            <ProtectedRoute>
              <Layout>
                <MyApplications />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            ANALYTICS
        ========================= */}

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


        {/* =========================
            RESUME
        ========================= */}

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


        {/* =========================
            RECOMMENDATIONS
        ========================= */}

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Layout>
                <Recommendations />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            AI INTERVIEW
        ========================= */}

        <Route
          path="/ai-interview"
          element={
            <ProtectedRoute>
              <Layout>
                <AIInterviewPage />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* =========================
            CAREER ANALYTICS
        ========================= */}

        <Route
          path="/career-analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <CareerAnalyticsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
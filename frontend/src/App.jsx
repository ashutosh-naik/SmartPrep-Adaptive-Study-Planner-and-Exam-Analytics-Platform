import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LandingPage from "./pages/landing/LandingPage";

// Protected Pages
import Dashboard from "./pages/dashboard/Dashboard";
import StudyPlanner from "./pages/planner/StudyPlanner";
import BacklogView from "./pages/planner/BacklogView";
import TaskTracking from "./pages/tasks/TaskTracking";
import MockTests from "./pages/tests/MockTests";
import TestAttempt from "./pages/tests/TestAttempt";
import TestResult from "./pages/tests/TestResult";
import Analytics from "./pages/analytics/Analytics";
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/onboarding/Onboarding";
import SubjectManager from "./pages/subjects/SubjectManager";
import Notes from "./pages/notes/Notes";
import AIChatAssistant from "./components/AIChatAssistant";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import InstructorPortal from "./pages/instructor/InstructorPortal";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isOnboarded = localStorage.getItem("sp_onboarded") === "true";

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Register />
            )
          }
        />

        {/* Onboarding — protected but no sidebar */}
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              {isOnboarded ? <Navigate to="/dashboard" /> : <Onboarding />}
            </PrivateRoute>
          }
        />

        {/* Protected Routes with Sidebar Layout */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 ml-0 lg:ml-64">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/planner" element={<StudyPlanner />} />
                    <Route path="/planner/backlog" element={<BacklogView />} />
                    <Route path="/tasks" element={<TaskTracking />} />
                    <Route path="/tests" element={<MockTests />} />
                    <Route path="/tests/:id" element={<TestAttempt />} />
                    <Route path="/tests/:id/result" element={<TestResult />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/subjects" element={<SubjectManager />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/instructor" element={<InstructorPortal />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <AIChatAssistant />
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

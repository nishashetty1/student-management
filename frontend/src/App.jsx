import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./stores/authStore";

// Components
import Navbar from "./components/layout/Navbar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/StudentList";
import StudentForm from "./pages/StudentForm";
import CourseList from "./pages/CourseList";
import CourseForm from "./pages/CourseForm";
import NotFound from "./pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/add"
              element={
                <ProtectedRoute>
                  <StudentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/edit/:id"
              element={
                <ProtectedRoute>
                  <StudentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CourseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/add"
              element={
                <ProtectedRoute>
                  <CourseForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/edit/:id"
              element={
                <ProtectedRoute>
                  <CourseForm />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

export default App;

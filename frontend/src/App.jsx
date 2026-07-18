import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SeatMap from './pages/SeatMap';
import MyReservations from './pages/MyReservations';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerStudents from './pages/ManagerStudents';
import ManagerReport from './pages/ManagerReport';
import ManagerScanner from './pages/ManagerScanner';
import ManagerMap from './pages/ManagerMap';
import ManagementIssuesList from './pages/ManagementIssueList';
import FAQ from './pages/FAQ';
import StudentHistory from './pages/StudentHistory';
import Notification from './pages/Notification';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role?.toLowerCase() === 'manager' ? '/manager' : '/home'} replace />;
}

export default function App() {
  useEffect(() => {
    const stored = localStorage.getItem('sl_dark_mode');
    if (stored !== null) {
      document.documentElement.setAttribute('data-theme', stored === 'true' ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student routes */}
            <Route path="/home"           element={<ProtectedRoute allowedRoles={['student', 'guest']}><Home /></ProtectedRoute>} />
            <Route path="/map"            element={<ProtectedRoute allowedRoles={['student', 'guest']}><SeatMap /></ProtectedRoute>} />
            <Route path="/reservations"   element={<ProtectedRoute allowedRoles={['student', 'guest']}><MyReservations /></ProtectedRoute>} />
            <Route path="/profile"        element={<ProtectedRoute allowedRoles={['student', 'manager', 'guest']}><Profile /></ProtectedRoute>} />
            <Route path="/feedback"       element={<ProtectedRoute allowedRoles={['student', 'manager', 'guest']}><Feedback /></ProtectedRoute>} />
            <Route path="/faq"            element={<ProtectedRoute allowedRoles={['student', 'manager', 'guest']}><FAQ /></ProtectedRoute>} />
            <Route path="/notifications"  element={<ProtectedRoute allowedRoles={['student', 'guest']}><Notification /></ProtectedRoute>} />

            {/* Manager routes */}
            <Route path="/manager"          element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/manager/map"      element={<ProtectedRoute allowedRoles={['manager']}><ManagerMap /></ProtectedRoute>} />
            <Route path="/manager/students" element={<ProtectedRoute allowedRoles={['manager']}><ManagerStudents /></ProtectedRoute>} />
            <Route path="/manager/report"   element={<ProtectedRoute allowedRoles={['manager']}><ManagerReport /></ProtectedRoute>} />
            <Route path="/manager/scan"     element={<ProtectedRoute allowedRoles={['manager']}><ManagerScanner /></ProtectedRoute>} />
            <Route path="/manager/feedback/management-issues"     element={<ProtectedRoute allowedRoles={['manager']}><ManagementIssuesList /></ProtectedRoute>} />
            <Route path="/manager/students/:userId/history" element={<StudentHistory />} />

            <Route path="*" element={<Navigate to="/" replace />} />



          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
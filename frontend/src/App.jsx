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

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role?.toLowerCase() === 'manager' ? '/manager' : '/home'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student routes */}
            <Route path="/home" element={<ProtectedRoute allowedRoles={['student']}><Home /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute allowedRoles={['student']}><SeatMap /></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute allowedRoles={['student']}><MyReservations /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['student', 'manager']}><Profile /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute allowedRoles={['student', 'manager']}><Feedback /></ProtectedRoute>} />
            <Route path="/faq" element={<FAQ />} />

            {/* Manager routes */}
            <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/manager/students" element={<ProtectedRoute allowedRoles={['manager']}><ManagerStudents /></ProtectedRoute>} />
            <Route path="/manager/report" element={<ProtectedRoute allowedRoles={['manager']}><ManagerReport /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Report from './pages/Report';
import AdminDashboard from './pages/AdminDashboard';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import ViewMap from './pages/ViewMap';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { currentUser, isAdmin } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/report" 
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/view-map" element={<ViewMap />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 
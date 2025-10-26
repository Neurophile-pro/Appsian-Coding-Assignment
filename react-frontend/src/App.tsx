import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/context_AuthContext';
import ProtectedRoute from "./components/Layout/components_Layout_ProtectedRoute";
import Login from './components/Auth/components_Auth_Login';
import Register from './components/Auth/components_Auth_Register';
import Dashboard from './components/Dashboard/components_Dashboard_Dashboard';
import ProjectDetails from './components/ProjectDetails/components_ProjectDetails_ProjectDetails';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { useState } from 'react';
import LoginPage from './components/Login';
import SignupPage from './components/Signup';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { AuthProvider } from './context/AuthProvider';
import Sidebar from './components/Sidebar';
import ChatApp from './components/ChatApp';
import TwatchAI from './components/TwatchAI';
import Patients from './components/Patients';
import PatientCardContent from './components/PatientCardContent';

function App() {
  const location = useLocation();
  const hideSidebarRoutes = ['/login', '/signup'];
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);
  return (
    <AuthProvider>
      <div className="flex">
        {shouldShowSidebar && <Sidebar />}
        <div className={shouldShowSidebar ? "flex-1" : "flex-1"}>
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><ChatApp /></PrivateRoute>} />
            <Route path="/chat/:patientId" element={<PrivateRoute><ChatApp /></PrivateRoute>} />
            <Route path="/twatch-ai" element={<PrivateRoute><TwatchAI /></PrivateRoute>} />
            <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
            <Route path="/patients/:id/*" element={<PrivateRoute><PatientCardContent /></PrivateRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
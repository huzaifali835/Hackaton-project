import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/Auth/contextAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/users/UserDashboard';
import AdminPanel from './pages/admin/AdminDashboard';
import AdminUserData from './pages/admin/AdminUserData';
import UserEditProfile from './pages/users/UserEditProfile';
import AdminMessage from './pages/users/AdminMessage';
import UserProfile from './pages/users/UserProfile';
import JobList from './pages/jobs/JobList';
import AdminAppliedJobs from './pages/admin/AdminAppliedJobs';
import JobStatus from './pages/jobs/JobStatus';
import EventManager from './pages/Event/EventManager';
import EventsPage from './pages/Event/EventPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<ProtectedRoute component={UserDashboard} role="user" />} />
        <Route path="/user/editprofile" element={<ProtectedRoute component={UserEditProfile} role="user" />} />
        <Route path="/user/adminmessage" element={<ProtectedRoute component={AdminMessage} role="user" />} />
        <Route path="/user/events" element={<ProtectedRoute component={EventsPage} role="user" />} />
        <Route path="/user/:userId" element={<ProtectedRoute component={UserProfile} />} />
        <Route path="/user/viewjobstatus" element={<JobStatus/>}></Route>
        <Route path="/admin" element={<ProtectedRoute component={AdminPanel} role="admin" />} />
        <Route path="/admin/usersdata" element={<ProtectedRoute component={AdminUserData} role="admin" />} />
        <Route path='/admin/viewalljobs' element={<ProtectedRoute component={JobList} role="admin" />}></Route>
        <Route path="/admin/applied-jobs"element={<ProtectedRoute component={AdminAppliedJobs} role="admin" />} />
        <Route path="/admin/manageEvent"element={<ProtectedRoute component={EventManager} role="admin" />} />

      </Routes>
    </AuthProvider>
  );
}

function ProtectedRoute({ component: Component, role }) {
  const { user, isAdmin } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role === "admin" && !isAdmin) {
    return <Navigate to="/user" />;
  }

  return <Component />;
}


export default App;

// import React from 'react';
import Signup from './Pages/SignupPage';
import Login from './Pages/LoginPage';
import { Routes, Route } from 'react-router-dom'; 
import HomePage from './Pages/Homepage';
import AddPackageForm from './Pages/AddPackageForm';
import BookingPage from './Pages/Booking';
import NotFound from './Pages/NotFound';
import { Profile } from './Pages/Profile';
import NotificationsPage from './Pages/NotificationsPage';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addPackage" element={<AddPackageForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking/:owner" element={<BookingPage />} />
        <Route path="/notFound" element={<NotFound />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
  );
};

export default App;
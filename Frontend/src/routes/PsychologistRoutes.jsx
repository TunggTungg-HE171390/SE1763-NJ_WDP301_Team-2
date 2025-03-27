import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ViewSchedule from '../screens/psychologist/viewSchedule/viewSchedule';
import ViewAppointmentDetail from '../screens/psychologist/viewAppointmentDetail/viewAppointmentDetail';
import { useAuth } from '../components/auth/authContext';

const PsychologistRoutes = () => {
  const { user } = useAuth();
  
  // Check if user is a psychologist
  if (!user || user.role !== 'psychologist') {
    return <Navigate to="/login" />;
  }
  
  return (
    <Routes>
      <Route path="/view-schedule" element={<ViewSchedule />} />
      <Route path="/view-appointment-detail/:appointmentId" element={<ViewAppointmentDetail />} />
      <Route path="*" element={<Navigate to="/psychologist/view-schedule" />} />
    </Routes>
  );
};

export default PsychologistRoutes;

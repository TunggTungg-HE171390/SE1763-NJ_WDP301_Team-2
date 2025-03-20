import React from 'react';
import { Route } from 'react-router-dom';
import StaffLayout from '../layouts/StaffLayout';
import Dashboard from '../screens/staff/Dashboard';
import ManagePsychologists from '../screens/staff/ManagePsychologists';
import PsychologistDetail from '../screens/staff/PsychologistDetail';
import EditPsychologistExperience from '../screens/staff/EditPsychologistExperience';
import EditPsychologistWorkHistory from '../screens/staff/EditPsychologistWorkHistory';
// ...other imports

const StaffRoutes = () => {
  return (
    <Route path="/staff" element={<StaffLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="manage-psychologists" element={<ManagePsychologists />} />
      <Route path="psychologist-detail/:id" element={<PsychologistDetail />} />
      {/* <Route path="edit-psychologist/:id" element={<EditPsychologist />} /> */}
      <Route path="edit-psychologist-experience/:id" element={<EditPsychologistExperience />} />
      <Route path="edit-psychologist-work-history/:id" element={<EditPsychologistWorkHistory />} />
      {/* ...other existing routes */}
    </Route>
  );
};

export default StaffRoutes;

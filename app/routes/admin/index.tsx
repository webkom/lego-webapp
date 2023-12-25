import { Route, Routes } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import EmailRoute from './email';
import GroupPage from './groups/components/GroupPage';

const AdminRoute = () => (
  <Routes>
    <Route path="groups/:groupId/*" element={<GroupPage />} />
    <Route path="groups" element={<GroupPage />} />
    <Route path="email/*" element={<EmailRoute />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AdminRoute;

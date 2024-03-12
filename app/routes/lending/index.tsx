import { Route, Routes } from 'react-router-dom';
import LendableObjectDetail from 'app/routes/lending/components/LendableObjectDetail';
import LendableObjectEdit from 'app/routes/lending/components/LendableObjectEdit';
import LendableObjectsList from 'app/routes/lending/components/LendableObjectsList';
import PageNotFound from 'app/routes/pageNotFound';
import LendableObjectAdminDetail from './components/LendableObjectAdminDetail';
import LendingAdmin from './components/LendingAdmin';
import LendingRequest from './components/LendingRequest';
import LendingRequestAdmin from './components/LendingRequestAdmin';

const LendingRoute = () => (
  <Routes>
    <Route index element={<LendableObjectsList />} />
    <Route path="create" element={<LendableObjectEdit />} />
    <Route path=":lendableObjectId" element={<LendableObjectDetail />} />
    <Route path=":lendableObjectId/edit" element={<LendableObjectEdit />} />
    <Route
      path=":lendableObjectId/admin"
      element={<LendableObjectAdminDetail />}
    />
    <Route path="request/:lendingRequestId" element={<LendingRequest />} />
    <Route path="request/:lendingRequestId/admin" element={<LendingRequestAdmin />} />
    <Route path="admin/*" element={<LendingAdmin />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default LendingRoute;

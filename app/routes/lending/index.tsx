import { Route, Routes } from 'react-router-dom';
import LendableObjectDetail from 'app/routes/lending/components/LendableObjectDetail';
import LendableObjectEdit from 'app/routes/lending/components/LendableObjectEdit';
import LendableObjectsList from 'app/routes/lending/components/LendableObjectsList';
import PageNotFound from 'app/routes/pageNotFound';
import LendableObjectAdminDetail from './components/LendableObjectAdminDetail';
import LendingAdmin from './components/LendingAdmin';

const LendingRoute = () => (
  <Routes>
    <Route index element={<LendableObjectsList />} />
    <Route path="create" element={<LendableObjectEdit />} />
    <Route path=":lendableObjectId" element={<LendableObjectDetail />} />
    <Route path=":lendableObjectId/edit" element={<LendableObjectEdit />} />
    <Route path="admin/*" element={<LendingAdmin />} />
    <Route path="admin/:lendableObjectId" element={<LendableObjectAdminDetail />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default LendingRoute;

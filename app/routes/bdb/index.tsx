import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import AddSemester from './components/AddSemester';
import BdbDetail from './components/BdbDetail';
import BdbPage from './components/BdbPage';
import CompanyContactEditor from './components/CompanyContactEditor';
import CompanyEditor from './components/CompanyEditor';

const BdbRoute = () => (
  <Routes>
    <Route index element={<BdbPage />} />
    <Route path="add" element={<CompanyEditor />} />
    <Route path=":companyId" element={<BdbDetail />} />
    <Route path=":companyId/edit" element={<CompanyEditor />} />
    <Route path=":companyId/semesters/add" element={<AddSemester />} />
    <Route
      path=":companyId/company-contacts/add"
      element={<CompanyContactEditor />}
    />
    <Route
      path=":companyId/company-contacts/:companyContactId"
      element={<CompanyContactEditor />}
    />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default BdbRoute;

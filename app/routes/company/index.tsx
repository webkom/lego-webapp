import { Route, Routes } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import CompaniesPage from './components/CompaniesPage';
import CompanyDetail from './components/CompanyDetail';

const CompanyRoute = () => (
  <Routes>
    <Route path="" element={<CompaniesPage />} />
    <Route path=":companyId" element={<CompanyDetail />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default CompanyRoute;

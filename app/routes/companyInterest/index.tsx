import { Route, Routes } from 'react-router-dom';
import PageNotFound from 'app/routes/pageNotFound';
import CompanyInterestList from './components/CompanyInterestList';
import CompanyInterestPage from './components/CompanyInterestPage';
import CompanySemesterGUI from './components/CompanySemesterGUI';

const CompanyInterestRoute = () => (
  <Routes>
    <Route index element={<CompanyInterestList />} />
    <Route path="create" element={<CompanyInterestPage />} />
    <Route path="semesters" element={<CompanySemesterGUI />} />
    <Route path=":companyInterestId/edit" element={<CompanyInterestPage />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default CompanyInterestRoute;

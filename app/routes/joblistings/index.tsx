import { Route, Routes } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import JoblistingDetail from './components/JoblistingDetail';
import JoblistingEditor from './components/JoblistingEditor';
import JoblistingsPage from './components/JoblistingPage';

const JobListingsRoute = () => (
  <Routes>
    <Route index element={<JoblistingsPage />} />
    <Route path="create" element={<JoblistingEditor />} />
    <Route path=":joblistingIdOrSlug" element={<JoblistingDetail />} />
    <Route path=":joblistingId/edit" element={<JoblistingEditor />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default JobListingsRoute;

import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import PollDetail from './components/PollDetail';
import PollEditor from './components/PollEditor';
import PollsList from './components/PollsList';

const PollsRoute = () => (
  <Routes>
    <Route index element={<PollsList />} />
    <Route path="new" element={<PollEditor />} />
    <Route path=":pollsId" element={<PollDetail />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default PollsRoute;

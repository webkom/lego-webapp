import { Route, Routes } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import PollDetail from './components/PollDetail';
import { PollCreator } from './components/PollEditor';
import PollsList from './components/PollsList';

const PollsRoute = () => (
  <Routes>
    <Route index element={<PollsList />} />
    <Route path="new" element={<PollCreator />} />
    <Route path=":pollsId" element={<PollDetail />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default PollsRoute;

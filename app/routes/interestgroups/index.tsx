import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import InterestGroupDetail from './components/InterestGroupDetail';
import InterestGroupEdit from './components/InterestGroupEdit';
import InterestGroupList from './components/InterestGroupList';

const InterestGroupsRoute = () => (
  <Routes>
    <Route index element={<InterestGroupList />} />
    <Route path="create" element={<InterestGroupEdit />} />
    <Route path=":groupId" element={<InterestGroupDetail />} />
    <Route path=":groupId/edit" element={<InterestGroupEdit />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default InterestGroupsRoute;

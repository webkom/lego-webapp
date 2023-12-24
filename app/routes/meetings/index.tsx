import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import MeetingDetailWrapper from './MeetingDetailWrapper';
import MeetingEditor from './components/MeetingEditor';
import MeetingList from './components/MeetingList';

const MeetingRoute = () => (
  <Routes>
    <Route index element={<MeetingList />} />
    <Route path="create" element={<MeetingEditor />} />
    <Route path=":meetingId" element={<MeetingDetailWrapper />} />
    <Route path=":meetingId/edit" element={<MeetingEditor />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default MeetingRoute;

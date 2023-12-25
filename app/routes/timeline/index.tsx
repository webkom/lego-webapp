import { Route, Routes } from 'react-router-dom';
import TimelinePage from 'app/routes/timeline/components/TimelinePage';
import PageNotFound from '../pageNotFound';

const TimelineRoute = () => (
  <Routes>
    <Route index element={<TimelinePage />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default TimelineRoute;

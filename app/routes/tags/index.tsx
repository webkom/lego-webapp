import { Route, Routes } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import TagCloud from './components/TagCloud';
import TagDetail from './components/TagDetail';

const TagsRoute = () => (
  <Routes>
    <Route index element={<TagCloud />} />
    <Route path=":tagId" element={<TagDetail />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default TagsRoute;

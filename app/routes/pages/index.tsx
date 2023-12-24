import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import PageDetail from './components/PageDetail';
import PageEditor from './components/PageEditor';

const PagesRoute = () => (
  <Routes>
    <Route path="new" element={<PageEditor />} />
    <Route path=":section" element={<PageDetail />} />
    <Route path=":section/:pageSlug" element={<PageDetail />} />
    <Route path=":section/:pageSlug/edit" element={<PageEditor />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default PagesRoute;

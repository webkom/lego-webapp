import loadable from '@loadable/component';
import { Route, Routes } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import ForumDetail from './components/ForumDetail';
import ForumEditor from './components/ForumEditor';
import ThreadDetail from './components/ThreadDetail';
import ThreadEditor from './components/ThreadEditor';

const ForumList = loadable(() => import('./components/ForumList'));

const ForumRoute = () => (
  <Routes>
    <Route index element={<ForumList />} />
    <Route path=":forumId" element={<ForumDetail />} />
    <Route path="threads/:threadId" element={<ThreadDetail />} />
    <Route path="new" element={<ForumEditor />} />
    <Route path=":forumId/edit" element={<ForumEditor />} />
    <Route path=":forumId/new" element={<ThreadEditor />} />
    <Route path="threads/:threadId/edit" element={<ThreadEditor />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default ForumRoute;

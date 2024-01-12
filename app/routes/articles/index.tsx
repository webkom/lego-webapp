import { Route, Routes } from 'react-router-dom';
import Overview from 'app/routes/articles/components/Overview';
import PageNotFound from '../pageNotFound';
import ArticleDetail from './components/ArticleDetail';
import ArticleEditor from './components/ArticleEditor';

const ArticleRoute = () => (
  <Routes>
    <Route index element={<Overview />} />
    <Route path="new" element={<ArticleEditor />} />
    <Route path=":articleIdOrSlug" element={<ArticleDetail />} />
    <Route path=":articleId/edit" element={<ArticleEditor />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default ArticleRoute;

import { Route, Routes } from 'react-router-dom';
import ArticleList from 'app/routes/articles/components/ArticleList';
import PageNotFound from '../pageNotFound';
import ArticleDetail from './components/ArticleDetail';
import ArticleEditor from './components/ArticleEditor';

const ArticleRoute = () => (
  <Routes>
    <Route index element={<ArticleList />} />
    <Route path="new" element={<ArticleEditor />} />
    <Route path=":articleIdOrSlug" element={<ArticleDetail />} />
    <Route path=":articleId/edit" element={<ArticleEditor />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default ArticleRoute;

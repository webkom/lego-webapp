import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import AddQuote from './components/AddQuote';
import QuotePage from './components/QuotePage';

const QuotesRoute = () => (
  <Routes>
    <Route index element={<QuotePage />} />
    <Route path="add" element={<AddQuote />} />
    <Route path=":quoteId" element={<QuotePage />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default QuotesRoute;

import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import BrandPage from './components/BrandPage';

const BrandRoute = () => (
  <Routes>
    <Route index element={<BrandPage />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default BrandRoute;

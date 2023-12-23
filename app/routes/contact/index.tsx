import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from 'app/routes/pageNotFound';
import Contact from './components/Contact';

const ContactRoute = () => (
  <Routes>
    <Route index element={<Contact />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default ContactRoute;

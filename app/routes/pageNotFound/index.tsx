import { Route, Routes } from 'react-router-dom-v5-compat';
import HTTPError from 'app/routes/errors/HTTPError';

const PathNotFound = () => (
  <Routes>
    <Route path="*" element={<HTTPError />} />
  </Routes>
);

export default PathNotFound;

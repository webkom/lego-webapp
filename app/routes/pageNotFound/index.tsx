import { Route, Routes } from 'react-router-dom';
import HTTPError from 'app/routes/errors/HTTPError';

const PathNotFound = () => (
  <Routes>
    <Route path="*" element={<HTTPError />} />
  </Routes>
);

export default PathNotFound;

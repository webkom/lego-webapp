import { Route } from 'react-router-dom';
import HTTPError from 'app/routes/errors/HTTPError';

export default function PathNotFound() {
  return <Route path="" component={HTTPError} />;
}

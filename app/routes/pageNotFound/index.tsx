import { Route } from 'react-router-dom';
import PageNotFoundRoute from './PageNotFoundRoute';

export default function PathNotFound() {
  return <Route path="" component={PageNotFoundRoute} />;
}

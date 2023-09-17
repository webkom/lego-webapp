import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFoundRoute from './PageNotFoundRoute';

export default function PathNotFound() {
  return <CompatRoute path="" component={PageNotFoundRoute} />;
}

import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import PageNotFoundRoute from './PageNotFoundRoute';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

const old = {
  path: '*',
  ...resolveAsyncRoute(() => import('./PageNotFoundRoute'))
};

export default function PathNotFound() {
  return <Route path="" component={PageNotFoundRoute} />;
}

import PageNotFoundRoute from './PageNotFoundRoute';
import * as React from 'react';
import { Route } from 'react-router-dom';

export default function PathNotFound() {
  return <Route path="" component={PageNotFoundRoute} />;
}

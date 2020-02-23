// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import ContactRoute from './ContactRoute';
import PageNotFoundRoute from '../pageNotFound/PageNotFoundRoute';

const contactRoute = ({ match }: { match: { path: string } }) => (
  <Switch>
    <Route exact path={`${match.path}`} component={ContactRoute} />
    <Route component={PageNotFoundRoute} />
  </Switch>
);

export default function Contact() {
  return <Route path="/contact" component={contactRoute} />;
}

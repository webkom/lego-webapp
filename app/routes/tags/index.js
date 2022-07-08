// @flow
import { Route, Switch } from 'react-router-dom';

import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import TagDetailRoute from './TagDetailRoute';
import TagsListRoute from './TagsListRoute';

const tagsRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={TagsListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:tagId`}
          passedProps={{ currentUser, loggedIn }}
          Component={TagDetailRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Tag() {
  return <Route path="/tags" component={tagsRoute} />;
}

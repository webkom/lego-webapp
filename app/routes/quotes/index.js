// @flow
import { Route, Switch } from 'react-router-dom';

import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import QuoteDetailRoute from './QuoteDetailRoute';
import QuoteEditorRoute from './QuoteEditorRoute';
import QuotesRoute from './QuotesRoute';

const quotesRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={QuotesRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/add`}
          passedProps={{ currentUser, loggedIn }}
          Component={QuoteEditorRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:quoteId`}
          passedProps={{ currentUser, loggedIn }}
          Component={QuoteDetailRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Quotes() {
  return <Route path="/quotes" component={quotesRoute} />;
}

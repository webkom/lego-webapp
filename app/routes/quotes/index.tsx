import { useRouteMatch, Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import AddQuote from './components/AddQuote';
import QuotePage from './components/QuotePage';

const QuotesRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ loggedIn }) => (
        <Switch>
          <RouteWrapper
            exact
            path={path}
            passedProps={{ loggedIn }}
            Component={QuotePage}
          />
          <RouteWrapper
            exact
            path={`${path}/add`}
            passedProps={{ loggedIn }}
            Component={AddQuote}
          />
          <RouteWrapper
            exact
            path={`${path}/:quoteId`}
            passedProps={{ loggedIn }}
            Component={QuotePage}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  );
};

export default function Quotes() {
  return <Route path="/quotes" component={QuotesRoute} />;
}

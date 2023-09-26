import { Switch, useRouteMatch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import AddQuote from './components/AddQuote';
import QuotePage from './components/QuotePage';

const QuotesRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={`/quotes`} component={QuotePage} />
      <CompatRoute exact path={`${path}/add`} component={AddQuote} />
      <CompatRoute exact path={`${path}/:quoteId`} component={QuotePage} />
      <CompatRoute component={PageNotFound} />
    </Switch>
  );
};

export default QuotesRoute;

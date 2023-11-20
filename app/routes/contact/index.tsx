import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from 'app/routes/pageNotFound';
import Contact from './components/Contact';

const ContactRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={path} component={Contact} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default ContactRoute;

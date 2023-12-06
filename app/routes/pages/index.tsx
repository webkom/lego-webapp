import { useRouteMatch, Route, Switch } from 'react-router-dom';
import PageNotFound from '../pageNotFound';
import PageDetail from './components/PageDetail';
import PageEditor from './components/PageEditor';

const PagesRoute = ({}) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/new`} component={PageEditor} />
      <Route exact path={`${path}/:section`} component={PageDetail} />
      <Route exact path={`${path}/:section/:pageSlug`} component={PageDetail} />
      <Route
        exact
        path={`${path}/:section/:pageSlug/edit`}
        component={PageEditor}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Pages() {
  return <Route path="/pages" component={PagesRoute} />;
}

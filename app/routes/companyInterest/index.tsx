import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from 'app/routes/pageNotFound';
import CompanyInterestList from './components/CompanyInterestList';
import CompanyInterestPage from './components/CompanyInterestPage';
import CompanySemesterGUI from './components/CompanySemesterGUI';

const CompanyInterestRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={path} component={CompanyInterestList} />
      <CompatRoute
        exact
        path={`${path}/create`}
        component={CompanyInterestPage}
      />
      <Route exact path={`${path}/semesters`} component={CompanySemesterGUI} />
      <CompatRoute
        exact
        path={`${path}/:companyInterestId/edit`}
        component={CompanyInterestPage}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export const CompanyInterestInfoRoute = () => {
  const { path } = useRouteMatch();

  return <Route exact path={path} component={CompanyInterestPage} />;
};

export function CompanyInterest() {
  return <Route path="/companyInterest" component={CompanyInterestRoute} />;
}

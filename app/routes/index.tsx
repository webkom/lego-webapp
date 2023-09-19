import loadable from '@loadable/component';
import { Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import { AppRoute } from './app';

const CompanyInterestInfoRoute = loadable(() => import('./companyInterest'), {
  resolveComponent: (components) => components.CompanyInterestInfoRoute,
});
const CompanyInterest = loadable(() => import('./companyInterest'), {
  resolveComponent: (components) => components.CompanyInterest,
});
const Companies = loadable(() => import('./company'));
const Users = loadable(() => import('./users'));
const Articles = loadable(() => import('./articles'));
const Meetings = loadable(() => import('./meetings'));
const Admin = loadable(() => import('./admin'));
const Quotes = loadable(() => import('./quotes'));
const Photos = loadable(() => import('./photos'));
const Pages = loadable(() => import('./pages'));
const Search = loadable(() => import('./search'));
const InterestGroups = loadable(() => import('./interestgroups'));
const Joblistings = loadable(() => import('./joblistings'));
const PageNotFound = loadable(() => import('./pageNotFound'));
const Announcements = loadable(() => import('./announcements'));
const Bdb = loadable(() => import('./bdb'));
const Contact = loadable(() => import('./contact'));
const Timeline = loadable(() => import('./timeline'));
const Surveys = loadable(() => import('./surveys'));
const Tags = loadable(() => import('./tags'));
const Brand = loadable(() => import('./brand'));
const UserValidator = loadable(() => import('./userValidator'));
const Polls = loadable(() => import('./polls'));
const Events = loadable(() => import('./events'));
const Overview = loadable(() => import('./overview'));

const RouterConfig = () => (
  <>
    <Route path="/" component={AppWrapper} />
  </>
);

const AppWrapper = () => (
  <AppRoute>
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <RouteWrapper
            exact
            path="/"
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={Overview}
          />
          <CompatRoute path="/announcements" component={Announcements} />
          <CompatRoute path="/admin" component={Admin} />
          <Route path="/events" component={Events} />
          <Route path="/companies" component={Companies} />
          <Route path={['/contact', '/kontakt']} component={Contact} />
          <Route
            path={['/interest-groups', '/interestgroups']}
            component={InterestGroups}
          />
          <Route path="/joblistings" component={Joblistings} />
          <Route path="/meetings" component={Meetings} />
          <Route path="/pages" component={Pages} />
          <Route path="/photos" component={Photos} />
          <Route path="/polls" component={Polls} />
          <Route path="/quotes" component={Quotes} />
          <Route path="/search" component={Search} />
          <Route path="/surveys" component={Surveys} />
          <Route path="/tags" component={Tags} />
          <Route path="/timeline" component={Timeline} />
          <Route path="/users" component={Users} />
          <Route path="/validator" component={UserValidator} />
          <Route path="/brand" component={Brand} />
          <Route
            path="/(register-interest|interesse)"
            component={CompanyInterestInfoRoute}
          />
          <Route path="/companyInterest" component={CompanyInterest} />
          <Route path="/bdb" component={Bdb} />
          <Route path="/articles" component={Articles} />
          {/* 
          This will eat all routes that are written after this
          So one cant put any routes after pageNotFound
          */}
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  </AppRoute>
);

export default RouterConfig;

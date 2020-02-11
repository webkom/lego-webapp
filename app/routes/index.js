import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppRoute } from './app';
import Overview from './overview';
import Events from './events';
import Companies from './company';
import Users from './users';
import Articles from './articles';
import Meetings from './meetings';
import Admin from './admin';
import Quotes from './quotes';
import Podcasts from './podcasts';
import Photos from './photos';
import Pages from './pages';
import Search from './search';
import InterestGroups from './interestgroups';
import Joblistings from './joblistings';
import PageNotFound from './pageNotFound';
import Announcements from './announcements';
import {
  CompanyInterestEnglish,
  CompanyInterestNorwegian,
  CompanyInterest
} from './companyInterest';
import Bdb from './bdb';
import Contact from './contact';
import Timeline from './timeline';
import Surveys from './surveys';
import Tags from './tags';
import Brand from './brand';
import UserValidator from './userValidator';
import Polls from './polls';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';

const RouterConfig = () => (
  <>
    <Route path="/" component={AppWrapper} />
  </>
);

const AppWrapper = props => (
  <AppRoute {...props}>
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <RouteWrapper
            exact
            path="/"
            passedProps={{ currentUser, loggedIn }}
            Component={Overview}
          />
          <Route path="/announcements" component={Announcements} />
          <Route path="/admin" component={Admin} />
          <Route path="/events" component={Events} />
          <Route path="/companies" component={Companies} />
          <Route path="/contact" component={Contact} />
          <Route path="/interestgroups" component={InterestGroups} />
          <Route path="/joblistings" component={Joblistings} />
          <Route path="/meetings" component={Meetings} />
          <Route path="/pages" component={Pages} />
          <Route path="/photos" component={Photos} />
          <Route path="/podcasts" component={Podcasts} />
          <Route path="/polls" component={Polls} />
          <Route path="/quotes" component={Quotes} />
          <Route path="/search" component={Search} />
          <Route path="/surveys" component={Surveys} />
          <Route path="/tags" component={Tags} />
          <Route path="/timeline" component={Timeline} />
          <Route path="/users" component={Users} />
          <Route path="/validator" component={UserValidator} />
          <Route path="/brand" component={Brand} />
          <Route path="/interesse" component={CompanyInterestNorwegian} />
          <Route path="/register-interest" component={CompanyInterestEnglish} />
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

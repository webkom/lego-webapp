import React from 'react';
import Router from 'react-router';
import App from './components/App';
import Overview from './components/Overview';
import EventCalendarPage from './components/EventCalendarPage';
import EventPage from './components/EventPage';
import NotFoundPage from './components/NotFoundPage';
import StaticPage from './components/StaticPage';

var {Routes, Route, DefaultRoute, NotFoundRoute} = Router;

var routes = (
  <Route handler={App} path='/'>
    <Route name='events' handler={EventCalendarPage} />
    <Route name='event' path='/events/:eventId' handler={EventPage} />
    <Route name='staticPage' path='/p/:pageSlug' handler={StaticPage} />
    <DefaultRoute name='overview' handler={Overview} />
    <NotFoundRoute handler={NotFoundPage} />
  </Route>
);

export default routes;

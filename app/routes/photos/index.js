// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import GalleryListRoute from './GalleryListRoute';
import GalleryCreateRoute from './GalleryCreateRoute';
import GalleryDetailRoute from './GalleryDetailRoute';
import GalleryEditRoute from './GalleryEditRoute';
import GalleryPictureRoute from './GalleryPictureRoute';
import GalleryPictureEditRoute from './GalleryPictureEditRoute';
import PageNotFound from '../pageNotFound';
import MatchType from 'app/models';

const photosRoute = ({ match }: { match: MatchType }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={GalleryListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/new`}
          passedProps={{ currentUser, loggedIn }}
          Component={GalleryCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:galleryId`}
          passedProps={{ currentUser, loggedIn }}
          Component={GalleryDetailRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:galleryId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={GalleryEditRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:galleryId/picture/:pictureId`}
          passedProps={{ currentUser, loggedIn }}
          Component={GalleryPictureRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:galleryId/picture/:pictureId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={GalleryPictureEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Photos() {
  return <Route path="/photos" component={photosRoute} />;
}

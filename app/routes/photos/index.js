// @flow
import { Route, Switch } from 'react-router-dom';

import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import GalleryCreateRoute from './GalleryCreateRoute';
import GalleryDetailRoute from './GalleryDetailRoute';
import GalleryEditRoute from './GalleryEditRoute';
import GalleryListRoute from './GalleryListRoute';
import GalleryPictureEditRoute from './GalleryPictureEditRoute';
import GalleryPictureRoute from './GalleryPictureRoute';

const photosRoute = ({ match }: { match: { path: string } }) => (
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

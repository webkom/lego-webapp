import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import GalleryCreateRoute from './GalleryCreateRoute';
import GalleryDetailRoute from './GalleryDetailRoute';
import GalleryEditRoute from './GalleryEditRoute';
import GalleryPictureEditRoute from './GalleryPictureEditRoute';
import GalleryPictureRoute from './GalleryPictureRoute';
import Overview from './components/Overview';

const PhotosRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <CompatRoute exact path={`${path}`} component={Overview} />
          <RouteWrapper
            exact
            path={`${path}/new`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={GalleryCreateRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:galleryId`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={GalleryDetailRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:galleryId/edit`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={GalleryEditRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:galleryId/picture/:pictureId`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={GalleryPictureRoute}
          />
          <RouteWrapper
            exact
            path={`${path}/:galleryId/picture/:pictureId/edit`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={GalleryPictureEditRoute}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  );
};

export default function Photos() {
  return <Route path="/photos" component={PhotosRoute} />;
}

import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import GalleryDetail from './components/GalleryDetail';
import GalleryEditor from './components/GalleryEditor';
import GalleryPictureEditModal from './components/GalleryPictureEditModal';
import GalleryPictureModal from './components/GalleryPictureModal';
import Overview from './components/Overview';

const PhotosRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <CompatRoute exact path={`${path}`} component={Overview} />
      <CompatRoute exact path={`${path}/new`} component={GalleryEditor} />
      <CompatRoute
        exact
        path={`${path}/:galleryId`}
        component={GalleryDetail}
      />
      <CompatRoute
        exact
        path={`${path}/:galleryId/edit`}
        component={GalleryEditor}
      />
      <CompatRoute
        exact
        path={`${path}/:galleryId/picture/:pictureId`}
        component={GalleryPictureModal}
      />
      <CompatRoute
        exact
        path={`${path}/:galleryId/picture/:pictureId/edit`}
        component={GalleryPictureEditModal}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Photos() {
  return <Route path="/photos" component={PhotosRoute} />;
}

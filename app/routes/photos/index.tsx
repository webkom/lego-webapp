import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import GalleryDetail from './components/GalleryDetail';
import GalleryEditor from './components/GalleryEditor';
import GalleryPictureEditModal from './components/GalleryPictureEditModal';
import GalleryPictureModal from './components/GalleryPictureModal';
import Overview from './components/Overview';

const PhotosRoute = () => (
  <Routes>
    <Route index element={<Overview />} />
    <Route path="new" element={<GalleryEditor />} />
    <Route path=":galleryId" element={<GalleryDetail />} />
    <Route path=":galleryId/edit" element={<GalleryEditor />} />
    <Route
      path=":galleryId/picture/:pictureId"
      element={<GalleryPictureModal />}
    />
    <Route
      path=":galleryId/picture/:pictureId/edit"
      element={<GalleryPictureEditModal />}
    />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default PhotosRoute;

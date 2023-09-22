import { LoadingIndicator } from '@webkom/lego-bricks';
import { push } from 'connected-react-router';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchGallery, fetchGalleryMetadata } from 'app/actions/GalleryActions';
import {
  fetch,
  clear,
  uploadAndCreateGalleryPicture,
} from 'app/actions/GalleryPictureActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectGalleryById } from 'app/reducers/galleries';
import { SelectGalleryPicturesByGalleryId } from 'app/reducers/galleryPictures';
import helmet from 'app/utils/helmet';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import HTTPError from '../errors/HTTPError';
import GalleryDetail from './components/GalleryDetail';

const loadData = ({ match: { params } }, dispatch) =>
  Promise.all([
    dispatch(fetch(params.galleryId)).catch(),
    dispatch(fetchGallery(params.galleryId)).catch(() =>
      dispatch(fetchGalleryMetadata(params.galleryId))
    ),
  ]);

function mapStateToProps(state, props) {
  const { galleryId } = props.match.params;
  const { uploadStatus } = state.galleryPictures;
  return {
    uploadStatus,
    gallery: selectGalleryById(state, {
      galleryId,
    }),
    pictures: SelectGalleryPicturesByGalleryId(state, {
      galleryId,
    }),
    fetching: state.galleries.fetching || state.galleryPictures.fetching,
    hasMore: state.galleryPictures.hasMore,
  };
}

const propertyGenerator = (props, config) => {
  if (!props.gallery) return;
  return [
    {
      property: 'og:title',
      content: props.gallery.title,
    },
    {
      element: 'title',
      children: props.gallery.tile,
    },
    {
      element: 'link',
      rel: 'canonical',
      href: `${config.webUrl}/gallery/${props.gallery.id}`,
    },
    {
      property: 'og:description',
      content: props.gallery.description,
    },
    {
      property: 'og:url',
      content: `${config.webUrl}/gallery/${props.gallery.id}`,
    },
    {
      property: 'og:image',
      content: props.gallery.cover.file,
    },
  ];
};

const mapDispatchToProps = {
  push,
  fetch,
  clear,
  uploadAndCreateGalleryPicture,
};

function metadataHelper<Props>() {
  return (ActualComponent) => {
    class MetadataHelper extends PureComponent<Props & LoginProps> {
      render() {
        // Instead of relying on 'propagateError', this does
        // all the error handling by itself. This makes it possible
        // to render metadata-tags, so that we can share stuff without
        // having to provide explicit access to all the content.
        const { fetching, gallery, loggedIn, ...props } = this.props;

        if (gallery && gallery.createdAt) {
          return (
            <ActualComponent
              fetching={fetching}
              loggedIn={loggedIn}
              gallery={gallery}
              {...props}
            />
          );
        }

        if (fetching) {
          return <LoadingIndicator loading />;
        }

        if (!loggedIn) {
          // If metadata exists, show a login page
          return (
            <LoginPage
              gallery={gallery}
              loggedIn={loggedIn}
              fetching={fetching}
              {...props}
            />
          );
        }

        return <HTTPError />;
      }
    }

    return MetadataHelper;
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPreparedDispatch('fetchGalleryDetail', loadData),
  loadingIndicator(['gallery.title']),
  helmet(propertyGenerator),
  metadataHelper()
)(GalleryDetail);

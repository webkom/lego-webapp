import React, { PureComponent } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import HTTPError from '../errors/HTTPError';
import { LoginPage } from 'app/components/LoginForm';
import { compose } from 'redux';
import helmet from 'app/utils/helmet';
import { connect } from 'react-redux';
import { fetchGallery, fetchGalleryMetadata } from 'app/actions/GalleryActions';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import {
  fetch,
  uploadAndCreateGalleryPicture
} from 'app/actions/GalleryPictureActions';
import { push } from 'connected-react-router';
import GalleryDetail from './components/GalleryDetail';
import { selectGalleryById } from 'app/reducers/galleries';
import { SelectGalleryPicturesByGalleryId } from 'app/reducers/galleryPictures';

const loadData = ({ params }, dispatch) =>
  Promise.all([
    dispatch(fetch(params.galleryId)).catch(),
    dispatch(fetchGallery(params.galleryId)).catch(err =>
      dispatch(fetchGalleryMetadata(params.galleryId))
    )
  ]);

function mapStateToProps(state, props) {
  const { galleryId } = props.params;
  const { uploadStatus } = state.galleryPictures;

  return {
    uploadStatus,
    gallery: selectGalleryById(state, { galleryId }),
    pictures: SelectGalleryPicturesByGalleryId(state, { galleryId }),
    fetching: state.galleries.fetching || state.galleryPictures.fetching,
    hasMore: state.galleryPictures.hasMore
  };
}
const propertyGenerator = (props, config) => {
  if (!props.gallery) return;

  return [
    {
      property: 'og:title',
      content: props.gallery.title
    },
    {
      element: 'title',
      children: props.gallery.tile
    },
    {
      element: 'link',
      rel: 'canonical',
      href: `${config.webUrl}/gallery/${props.gallery.id}`
    },
    {
      property: 'og:description',
      content: props.gallery.description
    },
    {
      property: 'og:url',
      content: `${config.webUrl}/gallery/${props.gallery.id}`
    },
    {
      property: 'og:image',
      content: props.gallery.cover.file
    }
  ];
};

const mapDispatchToProps = { push, fetch, uploadAndCreateGalleryPicture };

function metadataHelper<Props>() {
  return ActualComponent => {
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  prepare(loadData),
  loadingIndicator(['gallery.title']),
  helmet(propertyGenerator),
  metadataHelper()
)(GalleryDetail);

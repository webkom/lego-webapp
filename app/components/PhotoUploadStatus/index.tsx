import { Card, Flex, Icon } from '@webkom/lego-bricks';
import { connect } from 'react-redux';
import { Gallery } from 'app/actions/ActionTypes';
import { Image } from 'app/components/Image';
import Tooltip from 'app/components/Tooltip';
import {
  selectGalleryPictureById,
  initialUploadStatus,
} from 'app/reducers/galleryPictures';
import styles from './PhotoUploadStatus.css';
import type {
  UploadStatus,
  GalleryPictureEntity,
} from 'app/reducers/galleryPictures';

type StateProps = {
  uploadStatus: UploadStatus;
  lastImage: GalleryPictureEntity | null | undefined;
};
type DispatchedProps = {
  hideUploadStatus: () => void;
};
type Props = StateProps & DispatchedProps;

const UploadStatusCard = ({
  uploadStatus,
  lastImage,
  hideUploadStatus,
}: Props) => {
  if (!uploadStatus.showStatus) return null;

  const uploadDone =
    uploadStatus.successCount + uploadStatus.failCount ===
    uploadStatus.imageCount;
  const hasFailedUploads = uploadStatus.failCount !== 0;

  return (
    <Card
      severity={!uploadDone ? 'info' : hasFailedUploads ? 'danger' : 'success'}
      className={styles.photoUploadStatus}
    >
      <Icon className={styles.close} onClick={hideUploadStatus} name="close" />

      {uploadDone ? (
        <Card.Header className={styles.header}>
          {uploadStatus.successCount > 1
            ? uploadStatus.successCount
            : hasFailedUploads
              ? 'Ingen'
              : 'Ett'}{' '}
          {hasFailedUploads ? `av ${uploadStatus.imageCount}` : ''}{' '}
          {uploadStatus.successCount === 1 ? 'bilde' : 'bilder'} ble lastet opp
        </Card.Header>
      ) : (
        <>
          <Card.Header>
            Laster opp {uploadStatus.imageCount > 1 ? 'bildene' : 'bildet'} ...
          </Card.Header>
          <p>
            <b>Status</b>: {uploadStatus.successCount} av{' '}
            {uploadStatus.imageCount}
          </p>
        </>
      )}

      {hasFailedUploads && (
        <Tooltip
          content={
            <Flex column>
              {uploadStatus.failedImages.map(
                (
                  name,
                  index, // Since we never remove elements from the list, we can use
                ) => (
                  // the index as the key,
                  <Flex key={index}>{name}</Flex>
                ),
              )}
            </Flex>
          }
        >
          {uploadStatus.failCount} feil
        </Tooltip>
      )}

      {lastImage && (
        <Image
          alt="Siste bilde"
          style={{
            width: 250,
            height: 100,
            objectFit: 'cover',
          }}
          src={lastImage.thumbnail}
        />
      )}
    </Card>
  );
};

const mapStateToProps: (arg0: any) => StateProps = (state) => {
  const {
    uploadStatus = initialUploadStatus,
  }: {
    uploadStatus: UploadStatus;
  } = state.galleryPictures;
  const lastImage: GalleryPictureEntity | null | undefined =
    selectGalleryPictureById(state, {
      pictureId: uploadStatus.lastUploadedImage,
    });
  return {
    uploadStatus,
    lastImage,
  };
};

const mapDispatchToProps = (dispatch) => ({
  hideUploadStatus: () =>
    dispatch({
      type: Gallery.HIDE_UPLOAD_STATUS,
    }),
});

const ConnectedUploadStatusCard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadStatusCard);
export default ConnectedUploadStatusCard;

//@flow
import { Fragment } from 'react';
import Card from 'app/components/Card';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import { connect } from 'react-redux';
import { Gallery } from 'app/actions/ActionTypes';
import Tooltip from 'app/components/Tooltip';
import {
  selectGalleryPictureById,
  type UploadStatus,
  type GalleryPictureEntity,
  initialUploadStatus,
} from 'app/reducers/galleryPictures';
import { Image } from 'app/components/Image';
import styles from './PhotoUploadStatus.css';

type StateProps = {
  uploadStatus: UploadStatus,
  lastImage: ?GalleryPictureEntity,
};

type DispatchedProps = {
  hideUploadStatus: () => void,
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

  const word = uploadStatus.successCount === 1 ? 'bilde' : 'bilder';

  return (
    <Card className={styles.photoUploadStatus}>
      <Icon className={styles.close} onClick={hideUploadStatus} name="close" />
      {uploadDone ? (
        <Fragment>
          <h3 className={styles.successMessage}>
            {uploadStatus.successCount} {word} ble lastet opp{' '}
          </h3>
        </Fragment>
      ) : (
        <Fragment>
          <h3>Laster opp bilder ...</h3>
          <p>
            <b>Status</b>: {uploadStatus.successCount} av{' '}
            {uploadStatus.imageCount}
          </p>
        </Fragment>
      )}
      {hasFailedUploads && (
        <Tooltip
          list
          content={
            <Flex column>
              {uploadStatus.failedImages.map((name, index) => (
                // Since we never remove elements from the list, we can use
                // the index as the key,
                <Flex key={index}>{name}</Flex>
              ))}
            </Flex>
          }
        >
          <b>Antall feil</b>: {uploadStatus.failCount}
        </Tooltip>
      )}

      {lastImage && (
        <Image
          alt="Last"
          style={{ width: 250, height: 100, objectFit: 'cover' }}
          src={lastImage.thumbnail}
        />
      )}
    </Card>
  );
};

const mapStateToProps: (any) => StateProps = (state) => {
  const { uploadStatus = initialUploadStatus }: { uploadStatus: UploadStatus } =
    state.galleryPictures;

  const lastImage: ?GalleryPictureEntity = selectGalleryPictureById(state, {
    pictureId: uploadStatus.lastUploadedImage,
  });
  return { uploadStatus, lastImage };
};

const mapDispatchToProps = (dispatch) => ({
  hideUploadStatus: () =>
    dispatch({
      type: Gallery.HIDE_UPLOAD_STATUS,
    }),
});

const ConnectedUploadStatusCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadStatusCard);

export default ConnectedUploadStatusCard;

import { Card, Flex, Icon, Image } from '@webkom/lego-bricks';
import { X } from 'lucide-react';
import { connect } from 'react-redux';
import Tooltip from '~/components/Tooltip';
import {
  selectGalleryPictureById,
  initialUploadStatus,
  hideUploadStatus,
} from '~/redux/slices/galleryPictures';
import styles from './PhotoUploadStatus.module.css';
import type { GalleryListPicture } from '~/redux/models/GalleryPicture';
import type { RootState } from '~/redux/rootReducer';
import type { UploadStatus } from '~/redux/slices/galleryPictures';

type StateProps = {
  uploadStatus: UploadStatus;
  lastImage: GalleryListPicture | undefined;
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
      <Icon
        className={styles.close}
        onPress={hideUploadStatus}
        iconNode={<X />}
      />

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

const mapStateToProps = (state: RootState): StateProps => {
  const {
    uploadStatus = initialUploadStatus,
  }: {
    uploadStatus: UploadStatus;
  } = state.galleryPictures;
  const lastImage = selectGalleryPictureById(
    state,
    uploadStatus.lastUploadedImage,
  );
  return {
    uploadStatus,
    lastImage,
  };
};

const mapDispatchToProps = (dispatch) => ({
  hideUploadStatus: () => dispatch(hideUploadStatus()),
});

const ConnectedUploadStatusCard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UploadStatusCard);
export default ConnectedUploadStatusCard;

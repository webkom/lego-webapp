import { Button, Card, Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './GalleryEditorActions.css';

type Props = {
  selectedCount: number;
  newPicutureStatus: number;
  onDeselect: () => void;
  onUpdateGalleryCover: () => void;
  onTogglePicturesStatus: (arg0: boolean) => void;
  onDeletePictures: () => void;
};

const GalleryEditorActions = ({
  selectedCount,
  onUpdateGalleryCover,
  onDeselect,
  onTogglePicturesStatus,
  onDeletePictures,
  newPicutureStatus,
}: Props) => {
  return (
    <Flex justifyContent="center">
      <Card className={cx(styles.fixed, selectedCount > 0 && styles.visible)}>
        <span>
          <b>{selectedCount}</b> valgt
        </span>
        <Flex wrap gap="var(--spacing-md)">
          <Button flat onPress={onDeselect}>
            Avbryt
          </Button>
          {selectedCount <= 1 && (
            <Button onPress={onUpdateGalleryCover}>Bruk som albumcover</Button>
          )}
          {newPicutureStatus !== -1 && (
            <Button
              danger={newPicutureStatus === 0}
              onPress={() => onTogglePicturesStatus(!!newPicutureStatus)}
            >
              {newPicutureStatus === 0 && 'Skjul'}
              {newPicutureStatus === 1 && 'Synliggjør'}
            </Button>
          )}
          <Button danger onPress={onDeletePictures}>
            Slett {selectedCount > 1 ? 'valgte' : 'valgt'}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default GalleryEditorActions;

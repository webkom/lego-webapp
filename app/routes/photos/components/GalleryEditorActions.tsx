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
        <Flex justifyContent="flex-end" wrap>
          <Button flat onClick={onDeselect}>
            Avbryt
          </Button>
          {selectedCount <= 1 && (
            <Button onClick={onUpdateGalleryCover}>Sett album cover</Button>
          )}
          {newPicutureStatus !== -1 && (
            <Button
              danger={newPicutureStatus === 0}
              onClick={() => onTogglePicturesStatus(!!newPicutureStatus)}
            >
              {newPicutureStatus === 0 && 'Skjul'}
              {newPicutureStatus === 1 && 'Synligjør'}
            </Button>
          )}
          <Button danger onClick={onDeletePictures}>
            Slett {selectedCount > 1 ? 'valgte' : 'valgt'}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

export default GalleryEditorActions;

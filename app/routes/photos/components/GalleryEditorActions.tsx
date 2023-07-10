import { Collapse } from 'react-collapse';
import Sticky from 'react-stickynode';
import Button from 'app/components/Button';
import Card from 'app/components/Card';
import { Flex } from 'app/components/Layout';
import styles from './Overview.css';

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
}: Props) => (
  <Collapse isOpened={selectedCount > 0}>
    <Sticky enabled={selectedCount > 0} innerZ={10} top={0}>
      <Card className={styles.actionContainer}>
        <Flex alignItems="center" justifyContent="space-between">
          <div className={styles.selectedElements}>{selectedCount} valgt</div>
          <div>
            <Button flat onClick={onDeselect}>
              Avbryt
            </Button>
            {selectedCount === 1 && (
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
          </div>
        </Flex>
      </Card>
    </Sticky>
  </Collapse>
);

export default GalleryEditorActions;

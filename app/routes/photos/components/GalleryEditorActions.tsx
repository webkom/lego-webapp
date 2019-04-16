

import React from 'react';
import { Flex } from 'app/components/Layout';
import Icon from 'app/components/Icon';
import { Collapse } from 'react-collapse';
import Sticky from 'react-stickynode';
import styles from './Overview.css';

type Props = {
  selectedCount: number,
  newPicutureStatus: number,
  onDeselect: () => void,
  onUpdateGalleryCover: () => void,
  onTogglePicturesStatus: boolean => void,
  onDeletePictures: () => void
};

const GalleryEditorActions = ({
  selectedCount,
  onUpdateGalleryCover,
  onDeselect,
  onTogglePicturesStatus,
  onDeletePictures,
  newPicutureStatus
}: Props) => (
  <Collapse isOpened={selectedCount > 0}>
    <Sticky enabled={selectedCount > 0} innerZ={10} top={0}>
      <div className={styles.actionsContainer}>
        <Flex className={styles.actions} justifyContent="space-between">
          <span>
            <Icon
              className={styles.deselectIcon}
              onClick={onDeselect}
              name="close"
            />
            {selectedCount} Selected
          </span>
          <div className={styles.actionBar}>
            {selectedCount === 1 && (
              <span className={styles.action} onClick={onUpdateGalleryCover}>
                Sett album cover
              </span>
            )}
            {newPicutureStatus !== -1 && (
              <span
                onClick={() => onTogglePicturesStatus(!!newPicutureStatus)}
                className={styles.action}
              >
                {newPicutureStatus === 0 && 'Skjul'}
                {newPicutureStatus === 1 && 'Synligjør'}
              </span>
            )}
            <span onClick={onDeletePictures} className={styles.action}>
              Slett
            </span>
          </div>
        </Flex>
      </div>
    </Sticky>
  </Collapse>
);

export default GalleryEditorActions;

// @flow

import React from 'react';
import Portal from 'react-portal';
import cx from 'classnames';
import styles from './Editor.css';
import { BLOCK_TAGS, MARK_TAGS } from './constants';

type Props = {
  state: Object,
  onOpen: boolean,
  onClickMark: () => void,
  onClickBlock: () => void
};

type HoverMenuButtonProps = {
  tag: Object,
  onClick: () => void,
  state: Object
};

const HoverMenuButton = ({ tag, onClick, state }: HoverMenuButtonProps) => {
  const active =
    tag.type === 'mark'
      ? state.activeMarks.some(mark => mark.type == tag.name)
      : state.blocks.some(node => node.type == tag.name);

  return (
    <span
      className={cx(
        styles.hoverMenuButton,
        active && styles.activeHoverMenuButton
      )}
      onMouseDown={e => onClick(e, tag.name)}
      data-active={active}
    >
      {tag.icon}
    </span>
  );
};

const HoverMenu = ({ state, onClickMark, onClickBlock, onOpen }: Props) =>
  <Portal isOpened onOpen={onOpen}>
    <div className={styles.hoverMenu}>
      {Object.keys(BLOCK_TAGS).map((tag, index) =>
        <HoverMenuButton
          key={`block-${index}`}
          state={state}
          onClick={onClickBlock}
          tag={BLOCK_TAGS[tag]}
        />
      )}
      {Object.keys(MARK_TAGS).map((tag, index) =>
        <HoverMenuButton
          key={`mark-${index}`}
          state={state}
          onClick={onClickMark}
          tag={MARK_TAGS[tag]}
        />
      )}
    </div>
  </Portal>;

export default HoverMenu;

// @flow

import React from 'react';
import Portal from 'react-portal';
import cx from 'classnames';
import styles from './Editor.css';
import { BLOCK_TAGS, MARK_TAGS } from './constants';
import type { TagKind, MarkType, BlockType } from './constants';

type Props = {
  state: Object,
  onOpen: boolean,
  onToggleMark: () => void,
  onToggleBlock: () => void
};

type HoverMenuButtonProps = {
  tag: Object,
  onClick: (SyntheticInputEvent, MarkType | BlockType) => void,
  state: Object,
  kind: TagKind
};

const HoverMenuButton = ({
  tag,
  onClick,
  state,
  kind
}: HoverMenuButtonProps) => {
  const active =
    kind === 'mark'
      ? state.activeMarks.some(mark => mark.type == tag.type)
      : state.blocks.some(node => node.type == tag.type);

  return (
    <span
      className={cx(
        styles.hoverMenuButton,
        active && styles.activeHoverMenuButton
      )}
      onMouseDown={e => onClick(e, tag.type)}
      data-active={active}
    >
      <i className={`fa fa-${tag.icon}`} />
    </span>
  );
};

const HoverMenu = ({ state, onToggleMark, onToggleBlock, onOpen }: Props) => (
  <Portal isOpened onOpen={onOpen}>
    <div className={styles.hoverMenu}>
      {BLOCK_TAGS.filter(tag => !tag.hoverHidden).map(tag => (
        <HoverMenuButton
          key={tag.type}
          kind="block"
          state={state}
          onClick={onToggleBlock}
          tag={tag}
        />
      ))}
      ||||
      {MARK_TAGS.map(tag => (
        <HoverMenuButton
          key={tag.type}
          kind="mark"
          state={state}
          onClick={onToggleMark}
          tag={tag}
        />
      ))}
    </div>
  </Portal>
);

export default HoverMenu;

// @flow

import React from 'react';
import { ContentState, ContentBlock } from 'draft-js';
import { Entity } from '../../util/constants';

export const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: () => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === Entity.LINK
    );
  }, callback);
};

type Props = {
  entityKey: string,
  children: string,
  contentState: ContentState
};

const Link = ({ contentState, entityKey, children }: Props) => {
  const { url } = contentState.getEntity(entityKey).getData();

  return (
    <a
      className="md-link"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      aria-label={url}
    >
      {children}
    </a>
  );
};

export default Link;

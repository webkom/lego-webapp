import React from 'react';
import { Entity as EntityConstants } from '../constants';
import { Entity } from 'draft-js';

export const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === EntityConstants.LINK
      );
    },
    callback
  );
};

type Props = {
  children: String,
  entityKey: String
}

export default (props: Props) => {
  const { url } = Entity.get(props.entityKey).getData();
  return (
    <a href={url}>{props.children}</a>
  );
};

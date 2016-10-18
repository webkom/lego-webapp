
import React from 'react';
import { Entity } from 'draft-js';
import Embed from './Embed';

export const AtomicBlock = (props) => {
  console.log('atomic', props);
  const entity = Entity.get(props.block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  if (type === 'image') {
    return (
      <div className="md-block-atomic-wrapper">
        <img role="presentation" src={data.src} />
        <div className="md-block-atomic-controls">
          <button>&times;</button>
        </div>
      </div>
    );
  }
  return <p>No supported block for {type}</p>;
};

export const AtomicRenderes = {
  embed: Embed
}

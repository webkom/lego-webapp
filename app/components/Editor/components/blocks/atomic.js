// @flow

import React from 'react';
import styles from './Atomic.css';
import BreakBlock from './break';

const atomicComponents = {
  separator: BreakBlock
};

type Props = {
  block: Object,
  blockProps: Object
};

const AtomicBlock = ({ blockProps, block }: Props) => {
  const content = blockProps.getEditorState().getCurrentContent();
  const entity = content.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  if (atomicComponents[type]) {
    const AtComponent = atomicComponents[type];

    return (
      <div className={styles.atomic}>
        <AtComponent data={data} />
      </div>
    );
  }

  return (
    <p>
      Block of type <b>{type}</b> is not supported.
    </p>
  );
};

export default AtomicBlock;

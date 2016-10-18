import BreakBlock from './blocks/Break';

import { Block } from './constants';

export default (setEditorState, getEditorState) => (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case Block.BREAK: return {
      component: BreakBlock,
      editable: false
    };
    default: return null;
  }
};

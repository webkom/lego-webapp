import TodoBlock from './blocks/todo';
import ImageBlock from './blocks/image';
import BreakBlock from './blocks/break';

import { Block } from './constants';

export default (setEditorState, getEditorState) => (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case Block.TODO: return {
      component: TodoBlock,
      props: {
        setEditorState,
        getEditorState
      }
    };
    case Block.IMAGE: return {
      component: ImageBlock
    };
    case Block.BREAK: return {
      component: BreakBlock,
      editable: false
    };
    default: return null;
  }
};

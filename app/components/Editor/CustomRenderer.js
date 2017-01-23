import { Entity } from 'draft-js';
import BreakBlock from './Blocks/Break';
import ImageBlock from './Blocks/Image';
import TodoBlock from './Blocks/Todo';
import { Block } from './constants';

export default (onChange, editorState) => (contentBlock) => {
  let type = contentBlock.getType();

  if (type === Block.ATOMIC) {
    type = Entity.get(contentBlock.getEntityAt(0)).type;
  }


  switch (type) {
    case Block.BREAK:
      return {
        component: BreakBlock,
        editable: false
      };
    case Block.IMAGE:
      return {
        component: ImageBlock,
        editable: false,
        props: { ...contentBlock.getData().toJS() }
      };
    case Block.TODO:
      return {
        component: TodoBlock,
        props: {
          onChange,
          editorState
        }
      };
    default:
      return null;
  }
};

import BreakBlock from './Blocks/Break';
import EmbedBlock from './Blocks/Embed';
import TodoBlock from './Blocks/Todo';
import { Block } from './constants';

export default (onChange, editorState) => (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case Block.BREAK:
      return {
        component: BreakBlock,
        editable: false
      };
    case Block.EMBED:
      return {
        component: EmbedBlock,
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

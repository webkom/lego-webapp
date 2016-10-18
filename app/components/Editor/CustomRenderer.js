import BreakBlock from './blocks/Break';
import { AtomicBlock } from './blocks/Atomic';
import EmbedBlock from './blocks/Embed';
import { Block } from './constants';

export default (setEditorState, getEditorState) => (contentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case Block.BREAK:
      return {
        component: BreakBlock,
        editable: false
      };
    case Block.ATOMIC:
      return {
        component: AtomicBlock,
        editable: false
      };
    case Block.EMBED:
      return {
        component: EmbedBlock,
        editable: false,
        props: { ...contentBlock.getData().toJS() }
      };
    default:
      return null;
  }
};

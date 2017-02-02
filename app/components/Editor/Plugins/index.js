import AutoReplaceText from 'slate-auto-replace-text';
import AutoReplace from 'slate-auto-replace';
import { insertParagraph } from '../utils';
import { Blocks } from '../constants';
import AutoMarkdown from './AutoMarkdown';

const enterOnVoidBlock = {
  onKeyDown(e, data, state) {
    if (e.keyCode === 13 && state.isCollapsed && state.startBlock.isVoid) {
      return insertParagraph(state);
    }
    return undefined;
  }
};

export const base = [
  enterOnVoidBlock,
  AutoReplaceText('(c)', '©'),
  AutoReplace({
    trigger: '-',
    before: /^(--)$/,
    after: /^$/,
    transform: (transform) => transform
        .setBlock({ type: Blocks.Break, isVoid: true })
        .collapseToStartOfNextBlock()
  })
];

export const blocks = [
  AutoMarkdown
];

export default {
  base,
  blocks
};

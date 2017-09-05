import AutoReplace from 'slate-auto-replace';
import { insertParagraph } from '../utils';
import { Blocks } from '../constants';
import AutoMarkdown from './AutoMarkdown';
import InlineStylesKeybindings from './InlineStylesKeybindings';

const enterOnVoidBlock = {
  onKeyDown(e, data, state) {
    if (e.keyCode === 13 && state.isCollapsed && state.startBlock.isVoid) {
      return insertParagraph(state);
    }
    return undefined;
  }
};

const copyPastePlugin = {
  onCopy(e, data, state) {}
};

const base = [
  enterOnVoidBlock,
  copyPastePlugin,
  AutoReplace({
    trigger: ')',
    before: /(\(c)$/i,
    transform: transform => transform.insertText('©')
  }),
  InlineStylesKeybindings
];

const blocks = [
  AutoMarkdown,
  AutoReplace({
    trigger: '-',
    before: /^(--)$/,
    after: /^$/,
    transform: transform =>
      transform
        .setBlock({ type: Blocks.Break, isVoid: true })
        .collapseToStartOfNextBlock()
  })
];

export default {
  base,
  blocks
};

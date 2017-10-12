/* eslint-disable consistent-return */
import { Blocks } from '../constants';

const getType = chars => {
  switch (chars) {
    case '1.':
      return Blocks.OL;
    case '-':
    case '+':
    case '*':
      return Blocks.UL;
    case '>':
      return Blocks.Blockquote;
    case '#':
      return Blocks.H1;
    case '##':
      return Blocks.H2;
    default:
      return null;
  }
};
/**
   * On space, if it was after an auto-markdown shortcut, convert the current
   * node into the shortcut's corresponding type.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

const onSpace = (e, state) => {
  if (state.isExpanded) return;
  const { startBlock, startOffset } = state;
  const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '');
  const type = getType(chars);

  if (!type) return;
  if (type === Blocks.LI && startBlock.type === Blocks.LI) return;
  e.preventDefault();

  let innerType = type;
  let outerType;
  if (type === Blocks.UL || type === Blocks.OL) {
    innerType = Blocks.LI;
    outerType = type;
  }

  let transform = state.transform().setBlock(innerType);

  if (outerType) {
    transform = transform.wrapBlock(outerType);
  }

  transform = transform
    .extendToStartOf(startBlock)
    .delete()
    .apply();

  return transform;
};

const onTab = (e, state) => {
  if (state.isExpanded) return;
  const { startBlock } = state;
  if (startBlock.type === Blocks.LI) {
    e.preventDefault();
    const transform = state
      .transform()
      // .unwrapBlock()
      // .wrapBlock(Blocks.OL)
      .apply();
    return transform;
  }
};

/**
   * On backspace, if at the start of a non-paragraph, convert it back into a
   * paragraph node.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

const onBackspace = (e, state) => {
  if (state.isExpanded) return;
  if (state.startOffset !== 0) return;
  const { startBlock } = state;

  if (startBlock.type === Blocks.Paragraph) return;
  e.preventDefault();

  const transform = state.transform().setBlock(Blocks.Paragraph);

  if (startBlock.type === Blocks.LI) transform.unwrapBlock();

  state = transform.apply();
  return state;
};

/**
   * On return, if at the end of a node type that should not be extended,
   * create a new paragraph below it.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

const onEnter = (e, state) => {
  if (state.isExpanded) return;
  const { startBlock, startOffset, endOffset } = state;
  if (startOffset === 0 && startBlock.length === 0)
    return onBackspace(e, state);
  if (endOffset !== startBlock.length) return;

  if (
    startBlock.type !== Blocks.H1 &&
    startBlock.type !== Blocks.H2 &&
    startBlock.type !== Blocks.Blockquote &&
    startBlock.type !== Blocks.Cite
  ) {
    return;
  }

  e.preventDefault();
  return state
    .transform()
    .splitBlock()
    .setBlock(Blocks.Paragraph)
    .apply();
};

const onKeyDown = (e, data, state) => {
  switch (data.key) {
    case 'space':
      return onSpace(e, state);
    case 'backspace':
      return onBackspace(e, state);
    case 'enter':
      return onEnter(e, state);
    case 'tab':
      return onTab(e, state);
    default:
      return undefined;
  }
};

export default { onKeyDown };

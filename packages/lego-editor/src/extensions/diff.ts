import { Node, mergeAttributes } from '@tiptap/core';

export const Diff = Node.create({
  name: 'diff',

  group: 'inline',

  content: 'inline*',

  inline: true,

  addAttributes() {
    return {
      type: {
        default: 'ins',
        parseHTML: (element) => element.tagName.toLowerCase(),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'ins',
      },
      {
        tag: 'del',
      },
    ];
  },

  renderHTML({ node }) {
    const { type, ...attributes } = node.attrs;
    return [type, mergeAttributes(this.options.HTMLAttributes, attributes), 0];
  },
});

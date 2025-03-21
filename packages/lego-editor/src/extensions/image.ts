import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageFileKey: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        fileKey?: string;
      }) => ReturnType;
    };
  }
}
export const ImageWithFileKey = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fileKey: {
        default: null,
        parseHTML: (element) =>
          element.querySelector('img')?.getAttribute('data-file-key'),
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        ['data-file-key']: HTMLAttributes.fileKey,
      }),
    ];
  },
});

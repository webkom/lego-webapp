import {
  findChildrenInRange,
  mergeAttributes,
  Node,
  Tracker,
} from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';

export interface FigureOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figure: {
      /**
       * Add a figure element
       */
      setFigure: (options: {
        src: string;
        fileKey?: string;
        alt?: string;
        title?: string;
        caption?: string;
      }) => ReturnType;

      /**
       * Converts an image to a figure
       */
      imageToFigure: () => ReturnType;

      /**
       * Converts a figure to an image
       */
      figureToImage: () => ReturnType;
    };
  }
}

export const Figure = Node.create<FigureOptions>({
  name: 'figure',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  content: 'inline*',

  isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) =>
          element.querySelector('img')?.getAttribute('src'),
      },

      fileKey: {
        default: null,
        parseHTML: (element) =>
          element.querySelector('img')?.getAttribute('data-file-key'),
      },

      alt: {
        default: null,
        parseHTML: (element) =>
          element.querySelector('img')?.getAttribute('alt'),
      },

      title: {
        default: null,
        parseHTML: (element) =>
          element.querySelector('img')?.getAttribute('title'),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentElement: 'figcaption',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      this.options.HTMLAttributes,
      [
        'img',
        mergeAttributes(HTMLAttributes, {
          ['data-file-key']: HTMLAttributes.fileKey,
          draggable: false,
          contenteditable: false,
        }),
      ],
      ['figcaption', 0],
    ];
  },

  addCommands() {
    return {
      setFigure:
        ({ caption, ...attrs }) =>
        ({ chain }) => {
          return (
            chain()
              .insertContent({
                type: this.name,
                attrs,
                content: caption ? [{ type: 'text', text: caption }] : [],
              })
              // set cursor at end of caption field
              .command(({ tr, commands }) => {
                const { doc, selection } = tr;
                const position = doc.resolve(selection.to - 2).end();

                return commands.setTextSelection(position);
              })
              .run()
          );
        },

      imageToFigure:
        () =>
        ({ tr, commands }) => {
          const { doc, selection } = tr;
          const { from, to } = selection;
          const images = findChildrenInRange(
            doc,
            { from, to },
            (node) => node.type.name === 'image',
          );

          if (!images.length) {
            return false;
          }

          const tracker = new Tracker(tr);

          return commands.forEach(images, ({ node, pos }) => {
            const mapResult = tracker.map(pos);

            if (mapResult.deleted) {
              return false;
            }

            const range = {
              from: mapResult.position,
              to: mapResult.position + node.nodeSize,
            };

            return commands.insertContentAt(range, {
              type: this.name,
              attrs: {
                src: node.attrs.src,
                alt: node.attrs.alt,
                title: node.attrs.title,
                fileKey: node.attrs.fileKey,
              },
            });
          });
        },

      figureToImage:
        () =>
        ({ tr, commands }) => {
          const { doc, selection } = tr;
          const { from, to } = selection;
          const figures = findChildrenInRange(
            doc,
            { from, to },
            (node) => node.type.name === this.name,
          );

          if (!figures.length) {
            return false;
          }

          const tracker = new Tracker(tr);

          return commands.forEach(figures, ({ node, pos }) => {
            const mapResult = tracker.map(pos);

            if (mapResult.deleted) {
              return false;
            }

            const range = {
              from: mapResult.position,
              to: mapResult.position + node.nodeSize,
            };

            return commands.insertContentAt(range, {
              type: 'image',
              attrs: {
                src: node.attrs.src,
                alt: node.attrs.alt,
                title: node.attrs.title,
                fileKey: node.attrs.fileKey,
              },
            });
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ node, view, getPos, selected }) => {
      return (
        <NodeViewWrapper>
          <figure className={selected ? 'ProseMirror-selectednode' : ''}>
            <img
              src={node.attrs.src}
              data-file-key={node.attrs.fileKey}
              alt={node.attrs.alt}
              title={node.attrs.title}
              onClick={() => {
                // select the figure
                const { state, dispatch } = view;
                let tr = state.tr;
                const selection = NodeSelection.create(state.doc, getPos());
                tr = tr.setSelection(selection);
                dispatch(tr);
              }}
            />
            <NodeViewContent as="figcaption" />
          </figure>
        </NodeViewWrapper>
      );
    });
  },
});

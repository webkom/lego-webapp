import isUrl from 'is-url';
// Schema for the editor value
// This can handle normalizing and rules for the value
// If there are any rules for how the value should be, add them here
// TODO add normalizing for link with empty or invalid url
// TODO consider normalizing code blocks, (no marks, not inside lists?)
const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph');
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    }
  },
  blocks: {
    image: {
      isVoid: true,
      parent: { type: 'figure' },
      next: { type: 'image_caption' },
      normalize: (editor, { code, node }) => {
        switch (code) {
          case 'parent_type_invalid': {
            return editor.wrapBlockByKey(node.key, 'figure');
          }
          case 'next_sibling_type_invalid': {
          }
        }
      }
    },
    figure: {
      first: { type: 'image' },
      last: { type: 'image_caption' },
      normalize: (editor, { code, node, child }) => {
        switch (code) {
          case 'first_child_type_invalid': {
            return editor.removeNodeByKey(node.key);
          }
          case 'last_child_type_invalid': {
            const { document } = editor.value;
            const caption = Block.create('image_caption');
            return editor.insertNodeByKey(node.key, 1, caption);
          }
        }
      }
    },
    image_caption: {},
    list_item: {
      nodes: [
        {
          match: [
            { type: 'paragraph' },
            { type: 'h2' },
            { type: 'h4' },
            { type: 'link' }
          ]
        }
      ],
      // This converts value form the old editor to have blocks inside list items
      normalize: (editor, { code, node, child }) => {
        switch (code) {
          case 'child_type_invalid': {
            if (Text.isText(child)) {
              return editor
                .setNodeByKey(node.key, DEFAULT_BLOCK)
                .wrapBlockByKey(node.key, 'list_item');
            } else {
              return editor.setNodeByKey(child.key, DEFAULT_BLOCK);
            }
          }
        }
      }
    }
  },
  inlines: {
    link: {
      data: {
        url: url => isUrl(url)
      },
      normalize: (editor, { code, node }) => {
        switch (code) {
          case 'node_data_invalid': {
            return editor.unwrapLink();
          }
        }
      }
    }
  }
};

export default schema;

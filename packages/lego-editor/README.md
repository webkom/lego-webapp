# lego-editor

> Editor made for [lego-webapp](https://github.com/webkom/lego-webapp) written with [TipTap](https://tiptap.dev/docs)

## Installation

```bash
pnpm add @webkom/lego-editor
```

## Development

To test the editor using the development application, you can run the following commands:

```bash
cd packages/lego-editor
pnpm dev
```

### Formatting with Prettier

```bash
pnpm prettier
```

### Building and publishing

```
pnpm lint
pnpm build
pnpm publish
```

## Usage

### Rich-text editor

```tsx
import '@webkom/lego-editor/dist/index.css';
import { Editor } from '@webkom/lego-editor';

const App = () => {
  const [content, setContent] = useState('');

  return (
    <Editor
      placeholder="Write something..."
      content={content}
      onChange={setContent}
    />
  );
};
```

### static Editor content display

```tsx
import '@webkom/lego-editor/dist/index.css';
import { EditorContent } from '@webkom/lego-editor';

const App = () => {
  const content = '<p>Hello, world!</p>';

  return <EditorContent content={content} />;
};
```

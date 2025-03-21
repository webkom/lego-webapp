import '@webkom/lego-bricks/dist/style.css';
import { Editor, EditorContent } from '../../src';
import { useState } from 'react';
import './App.css';

const App = () => {
  const [content, setContent] = useState('');
  const [disabled, setDisabled] = useState(false);

  const handleDarkModeToggle = (e) => {
    const isChecked = e.target.checked;
    document.documentElement.setAttribute(
      'data-theme',
      isChecked ? 'dark' : 'light',
    );
  };

  return (
    <div>
      <h1>Lego editor example</h1>
      <label>
        Darkmode:
        <input type="checkbox" onChange={handleDarkModeToggle} />
      </label>
      <br />
      <label>
        Disabled:
        <input
          type="checkbox"
          checked={disabled}
          onChange={(e) => setDisabled(e.target.checked)}
        />
      </label>
      <br />
      <br />
      <b>LEGO editor:</b>
      <Editor
        content={content}
        placeholder="Write something..."
        imageUpload={(file) =>
          new Promise((resolve) => {
            resolve({ src: URL.createObjectURL(file) });
          })
        }
        disabled={disabled}
        onChange={setContent}
      />
      <br />
      <label>
        <b>Mirrored textarea:</b>
        <br />
        <textarea
          style={{ width: '100%' }}
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <br />
      <br />
      <label>
        <b>Read only EditorContent:</b>
        <br />
        <EditorContent content={content} />
      </label>
    </div>
  );
};

export default App;

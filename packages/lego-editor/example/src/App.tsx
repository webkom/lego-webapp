import '@webkom/lego-bricks/dist/style.css';
import Editor from '../../src/index';
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
      LEGO editor:
      <Editor
        content={content}
        placeholder="Write something..."
        // imageUpload={() =>
        //   new Promise((resolve) => {
        //     resolve({ src: null });
        //   })
        // }
        disabled={disabled}
        onChange={setContent}
      />
      <br />
      <label>
        Mirrored textarea:
        <br />
        <textarea
          style={{ width: '100%' }}
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
    </div>
  );
};

export default App;

import Editor from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import type { CSSProperties } from 'react';

type Props = {
  content: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  placeholder?: string;
};

/**
 * Renders `content` produced by the Editor component in a read-only format.
 */
function DisplayContent({ content, id, style, className, placeholder }: Props) {
  let domParser = null;

  if (!__CLIENT__) {
    const JSDOM = require('jsdom').JSDOM;

    domParser = (val) => new JSDOM(val).window.document;
  }

  return (
    <div key={content} id={id} style={style} className={className}>
      <Editor
        onChange={() => {}}
        onBlur={() => {}}
        onFocus={() => {}}
        value={content}
        placeholder={placeholder}
        disabled
        domParser={domParser}
      />
    </div>
  );
}

export default DisplayContent;

import Editor from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';
type Props = {
  /** The content to be displayed - the text */
  content: string;

  /** The id of the div wrapping the content - the id */
  id?: string;

  /** The classname of the div wrapping the content - the className */
  className?: string;

  /** Any style tp be added to the div wrapping the content - the style */
  style?: Record<string, any>;
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

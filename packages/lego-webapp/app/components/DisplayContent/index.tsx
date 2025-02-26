import { Skeleton } from '@webkom/lego-bricks';
import Editor from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './DisplayContent.module.css';
import type { CSSProperties } from 'react';

type Props = {
  content: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  placeholder?: string;
  skeleton?: boolean;
};

/**
 * Renders `content` produced by the Editor component in a read-only format.
 */
function DisplayContent({
  content,
  id,
  style,
  className,
  placeholder,
  skeleton = false,
}: Props) {
  let domParser = null;

  if (!__CLIENT__) {
    const JSDOM = require('jsdom').JSDOM;

    domParser = (val) => new JSDOM(val).window.document;
  }

  if (skeleton) {
    return (
      <div key={content} style={style}>
        <Skeleton className={styles.skeletonBody1} />
        <Skeleton className={styles.skeletonBody2} />
        <Skeleton className={styles.skeletonBody3} />
      </div>
    );
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

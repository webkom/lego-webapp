import { Skeleton } from '@webkom/lego-bricks';
import { EditorContent } from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/style.css';
import styles from './DisplayContent.module.css';
import type { CSSProperties } from 'react';

type Props = {
  content: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
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
  skeleton = false,
}: Props) {
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
      <EditorContent content={content ?? ''} />
    </div>
  );
}

export default DisplayContent;

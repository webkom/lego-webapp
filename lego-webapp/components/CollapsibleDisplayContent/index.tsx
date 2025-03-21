import { Icon, Skeleton } from '@webkom/lego-bricks';
import { EditorContent } from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/style.css';
import { type CSSProperties, useRef, useState } from 'react';
import styles from './CollapsibleDisplayContent.module.css';

type Props = {
  content?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  collapsedHeight?: number;
  skeleton?: boolean;
};

/**
 * Renders `content` produced by the Editor component in a collapsible read-only format.
 */
function CollapsibleDisplayContent({
  content,
  id,
  style,
  className,
  collapsedHeight = 250,
  skeleton = false,
}: Props) {
  const [isOpened, setIsOpened] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const useCollapse =
    collapsedHeight < ref.current?.clientHeight || !ref.current;

  return (
    <div
      className={styles.collapse}
      style={{
        height: !useCollapse
          ? null
          : isOpened
            ? ref.current?.clientHeight + 50
            : collapsedHeight + 'px',
      }}
    >
      {skeleton ? (
        <Skeleton className={styles.skeleton} />
      ) : (
        <div
          key={content}
          id={id}
          style={style}
          className={className}
          ref={ref}
        >
          <EditorContent content={content} />
        </div>
      )}
      {useCollapse && (
        <div className={styles.showMore}>
          <Icon
            onPress={() => {
              setIsOpened(!isOpened);
            }}
            name={isOpened ? 'chevron-up' : 'chevron-down'}
            className={styles.showMoreIcon}
            size={30}
          />
        </div>
      )}
    </div>
  );
}

export default CollapsibleDisplayContent;

import { Icon, Skeleton } from '@webkom/lego-bricks';
import Editor from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/style.css';
import 'react-image-crop/dist/ReactCrop.css';
import { type CSSProperties, useRef, useState } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import styles from './CollapsibleDisplayContent.module.css';

type Props = {
  content?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  placeholder?: string;
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
  placeholder,
  collapsedHeight = 250,
  skeleton = false,
}: Props) {
  const pageContext = usePageContext();

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
          <Editor
            onChange={() => {}}
            onBlur={() => {}}
            onFocus={() => {}}
            value={content}
            placeholder={placeholder}
            disabled
            domParser={import.meta.env.SSR ? pageContext.domParser : undefined}
          />
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

import styles from './Search.module.css';
import type { NavigationLink } from './utils';
import type { CSSProperties } from 'react';

type Props = {
  title: string;
  links: NavigationLink[];
  onCloseSearch: () => void;
  cascadeStartIndex: number;
  cascadeStepMs: number;
};

const getCascadeStyle = (index: number, cascadeStepMs: number) =>
  ({
    '--cascade-delay': `${index * cascadeStepMs}ms`,
  }) as CSSProperties;

const QuickLinks = ({
  title,
  links,
  onCloseSearch,
  cascadeStartIndex,
  cascadeStepMs,
}: Props) => {
  return (
    <div data-test-id="quick-links-section">
      <h2
        className={styles.quickLinksHeader}
        style={getCascadeStyle(cascadeStartIndex, cascadeStepMs)}
      >
        {title}
      </h2>
      <div className={styles.quickLinks}>
        {links.map(([href, name], index) => (
          <a
            key={href}
            href={href}
            className={styles.quickLink}
            onClick={onCloseSearch}
            style={getCascadeStyle(
              cascadeStartIndex + index + 1,
              cascadeStepMs,
            )}
          >
            {name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;

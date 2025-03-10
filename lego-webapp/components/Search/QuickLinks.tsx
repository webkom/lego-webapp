import styles from './Search.module.css';
import type { NavigationLink } from './utils';

type Props = {
  title: string;
  links: NavigationLink[];
  onCloseSearch: () => void;
};

const QuickLinks = ({ title, links, onCloseSearch }: Props) => {
  return (
    <div>
      <h2 className={styles.quickLinksHeader}>{title}</h2>
      <div className={styles.quickLinks}>
        {links.map(([href, name]) => (
          <a
            key={href}
            href={href}
            className={styles.quickLink}
            onClick={onCloseSearch}
          >
            {name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;

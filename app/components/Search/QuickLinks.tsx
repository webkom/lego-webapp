import ResolveLink from '../ResolveLink';
import styles from './Search.css';
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
        {links.map((link) => (
          <ResolveLink
            key={link[0]}
            link={link}
            className={styles.quickLink}
            onClick={onCloseSearch}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;

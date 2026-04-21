import { Search } from 'lucide-react';
import styles from './PageHero.module.css';

type Props = {
  groupCount: number;
  upcomingCount: number;
  search: string;
  onSearch: (value: string) => void;
};

const PageHero = ({ groupCount, upcomingCount, search, onSearch }: Props) => (
  <div className={styles.hero}>
    <p className={styles.meta}>
      <span className={styles.dot} />
      {groupCount} GRUPPER · {upcomingCount} KOMMENDE
    </p>
    <h1 className={styles.title}>
      <span className={styles.highlight}>Interesse</span>grupper
    </h1>
    <p className={styles.description}>
      Alt som skjer i Abakus&apos; {groupCount} interessegrupper - padel på
      tirsdag, strikkekveld på torsdag, LAN i helgen.
    </p>
    <div className={styles.actions}>
      <label className={styles.searchWrapper}>
        <Search size={15} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Søk arrangementer eller grupper..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </label>
      <a href="/interest-groups" className={styles.infoBtn}>
        Mer info
      </a>
    </div>
  </div>
);

export default PageHero;

import { Link } from 'react-router-dom';
import Card from 'app/components/Card';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import type { Event } from 'app/models';
import type { PublicArticle } from 'app/store/models/Article';
import styles from './Pinned.module.css';
import type { ReactElement } from 'react';

type Props = {
  item: Event | PublicArticle;
  url: string;
  meta: ReactElement<'span'> | null;
};

const Pinned = ({ item, url, meta }: Props) => (
  <Flex column className={styles.pinned}>
    <h3 className="u-ui-heading">Festet oppslag</h3>
    <Card hideOverflow className={styles.body}>
      <Link to={url} className={styles.innerLinks}>
        <Image
          className={styles.image}
          src={item.cover}
          placeholder={item.coverPlaceholder}
          height={500}
          width={1667}
          alt={`Cover of ${item.title}`}
        />
      </Link>
      <div className={styles.pinnedHeading}>
        <h2 className={styles.itemTitle}>
          <Link to={url}>{item.title}</Link>
        </h2>
        {meta}
      </div>
    </Card>
  </Flex>
);

export default Pinned;

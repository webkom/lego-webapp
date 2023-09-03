import { Card, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import type { PublicArticle } from 'app/store/models/Article';
import type { FrontpageEvent } from 'app/store/models/Event';
import styles from './Pinned.css';
import type { CSSProperties, ReactElement } from 'react';

type Props = {
  item: FrontpageEvent | PublicArticle;
  url: string;
  meta: ReactElement<'span'> | null;
  style?: CSSProperties;
};

const Pinned = ({ item, url, meta, style }: Props) => (
  <Flex column style={style} className={styles.pinned}>
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

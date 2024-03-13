import { Card, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import { isEvent } from 'app/reducers/frontpage';
import { useAppSelector } from 'app/store/hooks';
import styles from './Pinned.css';
import type { ArticleWithType, EventWithType } from 'app/reducers/frontpage';
import type { CSSProperties, ReactElement } from 'react';

type Props = {
  item?: ArticleWithType | EventWithType;
  url: string;
  meta: ReactElement<'span'> | null;
  style?: CSSProperties;
};

const Pinned = ({ item, url, meta, style }: Props) => {
  const fetching = useAppSelector(
    (state) =>
      state.frontpage.fetching ||
      (item && isEvent(item) ? state.events.fetching : state.articles.fetching)
  );

  return (
    <Flex column style={style} className={styles.pinned}>
      <h3 className="u-ui-heading">
        {fetching || item?.pinned ? 'Festet oppslag' : 'Oppslag'}
      </h3>

      <Card skeleton={fetching && !item} hideOverflow className={styles.body}>
        <Link to={url} className={styles.innerLinks}>
          <Image
            className={styles.image}
            src={item?.cover || ''}
            placeholder={item?.coverPlaceholder}
            height={500}
            width={1667}
            alt={`Cover of ${item?.title}`}
          />
        </Link>
        <div className={styles.pinnedHeading}>
          <h2 className={styles.itemTitle}>
            <Link to={url}>{item?.title}</Link>
          </h2>
          {meta}
        </div>
      </Card>
    </Flex>
  );
};

export default Pinned;

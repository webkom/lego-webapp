import { Link } from 'react-router-dom';
import Card from 'app/components/Card';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import type { Event } from 'app/models';
import { colorForEvent } from 'app/routes/events/utils';
import { eventStatus } from 'app/utils/eventStatus';
import styles from './EventItem.module.css';

type Props = {
  item: Event;
  url: string;
  meta: JSX.Element | null;
  loggedIn: boolean;
  isFrontPage: boolean;
};

const EventItem = ({ item, url, meta, loggedIn, isFrontPage }: Props) => {
  const info = eventStatus(item, loggedIn);
  return (
    <Card hideOverflow className={styles.body}>
      <Link to={url} className={styles.link}>
        <Flex className={styles.wrapper}>
          {isFrontPage ? (
            <Flex column className={styles.leftFrontpage}>
              {item.cover && (
                <Image
                  className={styles.imageFrontpage}
                  width={270}
                  height={80}
                  src={item.cover}
                  alt={`${item.title} cover image`}
                  placeholder={item.coverPlaceholder}
                />
              )}
              <span className={styles.info}>{info}</span>
            </Flex>
          ) : (
            <Flex column className={styles.left}>
              {item.cover && (
                <Image
                  className={styles.image}
                  src={item.cover}
                  placeholder={item.coverPlaceholder}
                  alt={`${item.title} cover image`}
                  width={390}
                  height={80}
                />
              )}
              <span className={styles.info}>{info}</span>
            </Flex>
          )}

          <div
            className={styles.right}
            style={{
              borderBottom: `5px solid ${colorForEvent(item.eventType)}`,
            }}
          >
            <>
              <h2 className={styles.itemTitle}>{item.title}</h2>
              {meta}
            </>
          </div>
        </Flex>
      </Link>
    </Card>
  );
};

export default EventItem;

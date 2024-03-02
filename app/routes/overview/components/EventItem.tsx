import { Card, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import { useUserContext } from 'app/routes/app/AppRoute';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import { eventStatus } from 'app/utils/eventStatus';
import styles from './EventItem.css';
import type { ListEvent } from 'app/store/models/Event';

type Props = {
  item?: ListEvent;
  url: string;
  meta: JSX.Element | null;
  isFrontPage: boolean;
};

const EventItem = ({ item, url, meta, isFrontPage }: Props) => {
  const { loggedIn } = useUserContext();
  const info = item && eventStatus(item, loggedIn);
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching,
  );

  return (
    <Card skeleton={fetching && !item} hideOverflow className={styles.body}>
      <Link to={url} className={styles.link}>
        <Flex className={styles.wrapper}>
          {isFrontPage ? (
            <Flex column className={styles.leftFrontpage}>
              {item?.cover && (
                <Image
                  className={styles.imageFrontpage}
                  width={270}
                  height={80}
                  src={item?.cover || ''}
                  alt={`${item?.title} cover image`}
                  placeholder={item?.coverPlaceholder}
                />
              )}
              <span className={styles.info}>{info}</span>
            </Flex>
          ) : (
            <Flex column className={styles.left}>
              {item?.cover && (
                <Image
                  className={styles.image}
                  src={item.cover}
                  placeholder={item?.coverPlaceholder}
                  alt={`${item?.title} cover image`}
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
              borderBottom: `5px solid ${colorForEventType(item?.eventType)}`,
            }}
          >
            <>
              <h2 className={styles.itemTitle}>{item?.title}</h2>
              {meta}
            </>
          </div>
        </Flex>
      </Link>
    </Card>
  );
};

export default EventItem;

import { Card, Flex, Image } from '@webkom/lego-bricks';
import { Link } from 'react-router';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { eventStatus } from '~/utils/eventStatus';
import styles from './EventItem.module.css';
import type { FrontpageEvent } from '~/redux/models/Event';

type Props = {
  item?: FrontpageEvent;
  url: string;
  meta: JSX.Element | null;
};

const FrontpageEventItem = ({ item, url, meta }: Props) => {
  const loggedIn = useIsLoggedIn();
  const info = item && eventStatus(item, loggedIn);
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching,
  );

  return (
    <Card skeleton={fetching && !item} hideOverflow className={styles.body}>
      <Link to={url} className={styles.link}>
        <Flex className={styles.wrapper}>
          <Flex column className={styles.leftFrontpage}>
            {item?.cover && (
              <Image
                className={styles.imageFrontpage}
                width={270}
                height={80}
                src={item?.cover || ''}
                alt={`Forsidebildet til ${item?.title}`}
                placeholder={item?.coverPlaceholder}
              />
            )}
            <span className={styles.info}>{info}</span>
          </Flex>

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

export default FrontpageEventItem;

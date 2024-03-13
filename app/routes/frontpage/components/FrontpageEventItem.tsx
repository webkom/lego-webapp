import { Card, Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import { useUserContext } from 'app/routes/app/AppRoute';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import { eventStatus } from 'app/utils/eventStatus';
import styles from './EventItem.css';
import type { FrontpageEvent } from 'app/store/models/Event';

type Props = {
  item?: FrontpageEvent;
  url: string;
  meta: JSX.Element | null;
};

const FrontpageEventItem = ({ item, url, meta }: Props) => {
  const { loggedIn } = useUserContext();
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
                alt={`${item?.title} cover image`}
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

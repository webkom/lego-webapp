import { Card, Flex, Icon, Image } from '@webkom/lego-bricks';
import { Calendar, Shapes } from 'lucide-react';
import { Children, isValidElement } from 'react';
import { colorForEventType } from '~/pages/events/utils';
import { useAppSelector } from '~/redux/hooks';
import styles from './EventItem.module.css';
import type { FrontpageEvent } from '~/redux/models/Event';

type Props = {
  item?: FrontpageEvent;
  url: string;
  meta: JSX.Element | null;
};

const FrontpageEventItem = ({ item, url, meta }: Props) => {
  const comitteeName = item?.responsibleGroup?.name;
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching,
  );
  const metaChildren = Children.toArray(meta?.props?.children).filter(Boolean);
  const startTime = metaChildren[0];
  const eventType = [...metaChildren]
    .reverse()
    .find(
      (child) =>
        isValidElement(child) &&
        child.type === 'span' &&
        typeof child.props.children === 'string' &&
        child.props.children.trim() !== '•',
    );

  return (
    <Card skeleton={fetching && !item} hideOverflow className={styles.body}>
      <a href={url} className={styles.link}>
        <Flex
          className={styles.wrapper}
          style={{
            border: `1px solid ${colorForEventType(item?.eventType)}`,
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          <Flex column className={styles.leftFrontpage}>
            {item?.cover && (
              <Image
                className={styles.imageFrontpage}
                src={item?.cover || ''}
                alt={`Forsidebildet til ${item?.title}`}
                style={{ borderRadius: 'var(--border-radius-md)' }}
                placeholder={item?.coverPlaceholder}
              />
            )}{' '}
          </Flex>
          <div className={styles.right}>
            <h2 className={styles.itemTitle}>{item?.title}</h2>
            <div className={styles.itemInfo}>
              <Flex alignItems="center" gap={5}>
                <Icon iconNode={<Calendar />} strokeWidth={1.2} size={20} />{' '}
                {startTime}
              </Flex>
              <Flex className={styles.comitteeInfo} gap={5}>
                <Icon iconNode={<Shapes />} strokeWidth={1.2} size={20} />
                {comitteeName && <>{comitteeName} |</>}
                {eventType}
              </Flex>
            </div>
          </div>
        </Flex>
      </a>
    </Card>
  );
};

export default FrontpageEventItem;

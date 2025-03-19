import { Card, Flex, Image } from '@webkom/lego-bricks';
import { colorForEventType } from '~/pages/events/utils';
import { useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { eventStatus } from '~/utils/eventStatus';
import styles from './EventItem.module.css';
import type { FrontpageEvent } from '~/redux/models/Event';
import ModalVideo from 'react-modal-video';
import { useState } from 'react';

const BRAINROT: boolean = true;

const videoIds: string[] = [
  'Wl959QnD3lM',
  '0HHZhFXz5b0',
  'F6WppvmDtP4',
  'rI3AA7KxJkQ',
  'WePNs-G7puA',
  'qyebBnusEoQ',
  'rYA6iLhjJu0',
  'wjEXseOFeGk',
  'I1aQiTV3ZjE',
  'md9-jG4RzXs',
  'O7DQ8AV2TZo',
  'uDM3Hy8Sfmw',
  'M93UWv-9Vfg',
];

const getRandomVideoId = (): string => {
  return videoIds[Math.floor(Math.random() * videoIds.length)];
};

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
      <a href={url} className={styles.link}>
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
      </a>
    </Card>
  );
};

export default FrontpageEventItem;

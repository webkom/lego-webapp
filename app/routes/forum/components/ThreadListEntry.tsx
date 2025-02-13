import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router';
import styles from './ForumList.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicThread } from 'app/store/models/Forum';

const ThreadListEntry = ({
  thread,
  className,
  forumId,
}: {
  thread: PublicThread;
  className: string;
  forumId: EntityId;
}) => {
  return (
    <Flex column className={cx(styles.threadEntry, className)}>
      <Link to={`/forum/${forumId}/threads/${thread.id}`}>
        <h2>{thread.title}</h2>
        <div>
          <p className="secondaryFontColor">
            {thread?.content.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 100)}
            {thread?.content.replace(/<\/?[^>]+(>|$)/g, '').length >= 100
              ? '...'
              : ''}
          </p>
        </div>
      </Link>
    </Flex>
  );
};

export default ThreadListEntry;

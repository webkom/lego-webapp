import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './ForumList.css';
import type { PublicThread } from 'app/store/models/Forum';

const ThreadListEntry = ({
  thread,
  className,
}: {
  thread: PublicThread;
  className: string;
}) => {
  return (
    <Flex column className={cx(styles.threadEntry, className)}>
      <Link to={`/forum/threads/${thread.id}`}>
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

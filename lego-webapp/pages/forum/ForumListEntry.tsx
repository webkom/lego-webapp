import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './ForumList.module.css';
import type { PublicForum } from '~/redux/models/Forum';

const ForumListEntry = ({ forum }: { forum: PublicForum }) => {
  return (
    <Flex column className={cx(styles.listEntry)}>
      <a href={`/forum/${forum.id}/threads`}>
        <h2>{forum.title}</h2>
        <div>
          <p className="secondaryFontColor">
            {forum.description.substring(0, 100)}
            {forum.description.length > 100 ? '...' : ''}
          </p>
        </div>
      </a>
    </Flex>
  );
};

export default ForumListEntry;

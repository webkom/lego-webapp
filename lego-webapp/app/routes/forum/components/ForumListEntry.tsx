import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router';
import styles from './ForumList.module.css';
import type { PublicForum } from '~/redux/models/Forum';

const ForumListEntry = ({ forum }: { forum: PublicForum }) => {
  return (
    <Flex column className={cx(styles.listEntry)}>
      <Link to={`/forum/${forum.id}/threads`}>
        <h2>{forum.title}</h2>
        <div>
          <p className="secondaryFontColor">
            {forum.description.substring(0, 100)}
            {forum.description.length > 100 ? '...' : ''}
          </p>
        </div>
      </Link>
    </Flex>
  );
};

export default ForumListEntry;

import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import styles from './ForumList.css';
import type { PublicForum } from 'app/store/models/Forum';

const ForumListEntry = ({ subForum }: { subForum: PublicForum }) => {
  return (
    <Flex column className={cx(styles.listEntry)}>
      <Link to={`/forum/${subForum.id}`}>
        <h2>{subForum.title}</h2>
        <div>
          <p className="secondaryFontColor">
            {subForum.description.substring(0, 100)}
            {subForum.description.length > 100 ? '...' : ''}
          </p>
        </div>
      </Link>
    </Flex>
  );
};

export default ForumListEntry;

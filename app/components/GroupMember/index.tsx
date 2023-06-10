import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import type { User } from 'app/models';
import styles from './GroupMember.module.css';

type Props = {
  user: User;
  leader?: boolean;
  co_leader?: boolean;
  social_admin?: boolean;
  recruiting?: boolean;
  treasurer?: boolean;
  pr_responsible?: boolean;
  groupName?: string;
};

const GroupMember = ({
  user,
  leader,
  co_leader,
  social_admin,
  recruiting,
  treasurer,
  pr_responsible,
  groupName,
}: Props) => {
  const isReadme = groupName === 'readme';
  return (
    <Link to={`/users/${user.username}`}>
      <div
        className={cx(
          styles.member,
          leader && styles.leader,
          co_leader && styles.coLeader
        )}
      >
        <Image
          alt="profilePicture"
          src={user.profilePicture}
          placeholder={user.profilePicturePlaceholder}
        />
        {leader && (
          <div className={styles.title}> {isReadme ? 'REDAKTØR' : 'LEDER'}</div>
        )}
        {co_leader && <div className={styles.title}>NESTLEDER</div>}
        {social_admin && <div className={styles.title}>SOSIALANSVARLIG</div>}
        {recruiting && <div className={styles.title}>OPPTAKSANSVARLIG</div>}
        {treasurer && <div className={styles.title}>ØKONOMIANSVARLIG</div>}
        {pr_responsible && <div className={styles.title}>PR-ANSVARLIG</div>}
        <div className={styles.name}>{user.fullName}</div>
      </div>
    </Link>
  );
};

export default GroupMember;

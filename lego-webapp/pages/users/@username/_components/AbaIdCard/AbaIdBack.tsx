import cx from 'classnames';
import styles from './AbaIdCard.module.css';
import type { AbaIdGroup } from './index';

const MAX_VISIBLE_GROUPS = 10;

type Props = {
  username: string;
  groups: AbaIdGroup[];
  hidden: boolean;
};

const AbaIdBack = ({ username, groups, hidden }: Props) => (
  <div
    className={cx(styles.face, styles.back)}
    aria-hidden={hidden}
    data-test-id="AbaId__back"
  >
    <div className={styles.stripe} />

    <div className={styles.backBody}>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Brukernavn</span>
        <div className={styles.fieldValue}>{username}</div>
      </div>

      {groups.length > 0 && (
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Grupper</span>
          <div className={styles.groupPills}>
            {groups.slice(0, MAX_VISIBLE_GROUPS).map((group) => (
              <span key={group.id} className={styles.groupPill}>
                <img src={group.logo} alt="" className={styles.groupLogo} />
                {group.name}
              </span>
            ))}
            {groups.length > MAX_VISIBLE_GROUPS && (
              <span className={styles.groupPill}>
                +{groups.length - MAX_VISIBLE_GROUPS}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={styles.backFooter}>abakus.no</div>
    </div>

    <div className={styles.foil} />
  </div>
);

export default AbaIdBack;

import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import styles from './AbaIdCard.module.css';
import type { AbaIdGroup } from './index';
import type { ReactNode } from 'react';

const MAX_VISIBLE_GROUPS = 10;

type Props = {
  username: string;
  groups: AbaIdGroup[];
  hidden: boolean;
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <Flex column gap="var(--spacing-sm)">
    <span className={styles.fieldLabel}>{label}</span>
    {children}
  </Flex>
);

const GroupPill = ({ children }: { children: ReactNode }) => (
  <Flex
    component="span"
    alignItems="center"
    gap="var(--spacing-xs)"
    className={styles.groupPill}
  >
    {children}
  </Flex>
);

const AbaIdBack = ({ username, groups, hidden }: Props) => (
  <Flex
    column
    className={cx(styles.face, styles.back)}
    aria-hidden={hidden}
    data-test-id="AbaId__back"
  >
    <div className={styles.stripe} />

    <Flex column gap="var(--spacing-lg)" className={styles.backBody}>
      <Field label="Brukernavn">
        <div className={styles.fieldValue}>{username}</div>
      </Field>

      {groups.length > 0 && (
        <Field label="Grupper">
          <Flex gap="var(--spacing-sm)" className={styles.groupPills}>
            {groups.slice(0, MAX_VISIBLE_GROUPS).map((group) => (
              <GroupPill key={group.id}>
                <img src={group.logo} alt="" className={styles.groupLogo} />
                {group.name}
              </GroupPill>
            ))}
            {groups.length > MAX_VISIBLE_GROUPS && (
              <GroupPill>+{groups.length - MAX_VISIBLE_GROUPS}</GroupPill>
            )}
          </Flex>
        </Field>
      )}

      <div className={styles.backFooter}>abakus.no</div>
    </Flex>

    <div className={styles.foil} />
  </Flex>
);

export default AbaIdBack;

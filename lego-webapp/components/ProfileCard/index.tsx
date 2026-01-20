import { Flex } from '@webkom/lego-bricks';
import { QRCode } from 'react-qrcode-logo';
import abakusBall from '~/assets/abakus-ball.png';
import { CircularPicture } from '~/components/Image';
import { PublicGroup } from '~/redux/models/Group';
import { getPrimaryGroupWithLogo } from '~/utils/getPrimaryGroup';
import styles from './ProfileCard.module.css';
import type Membership from '~/redux/models/Membership';

interface Props {
  firstName: string;
  lastName: string;
  username: string;
  grade?: string;
  memberships: Membership[];
  groupEntities: Record<number, PublicGroup>;
}

export const ProfileCard = ({
  firstName,
  lastName,
  username,
  grade,
  memberships,
  groupEntities,
}: Props) => {
  const primaryMembership = getPrimaryGroupWithLogo(memberships, groupEntities);
  return (
    <Flex column justifyContent="center" margin="var(--spacing-xl) 0 0 0">
      <div className={styles.info}>
        <div className={styles.qrCanvas}>
          <QRCode
            value={username}
            qrStyle="fluid"
            size={190}
            quietZone={15}
            eyeRadius={{
              outer: 10,
              inner: 6,
            }}
          />
        </div>
        <h2>
          {firstName} {lastName}
        </h2>
        <div className={styles.gradeRectangle}>
          <p>{grade}</p>
        </div>
      </div>
      <div className={styles.divider}></div>
      <Flex alignItems="center" justifyContent="space-between">
        <div className={styles.bottomInfo}>
          <p>BRUKERNAVN:</p>
          <h3>{username}</h3>
        </div>
        <div className={styles.groupLogo}>
          <CircularPicture
            src={
              primaryMembership?.abakusGroup.name
                ? primaryMembership.abakusGroup.logo!
                : abakusBall
            }
            alt={
              primaryMembership?.abakusGroup.name
                ? primaryMembership?.abakusGroup.name
                : 'Abakus kule'
            }
            size={40}
            className={styles.groupLogo}
          ></CircularPicture>
        </div>
      </Flex>
    </Flex>
  );
};

export default ProfileCard;

// @flow

import styles from './InterestgroupPlacard.css';
import cx from 'classnames';

import Flex from 'app/components/Layout/Flex';
import { Image } from 'app/components/Image';
import Placard from './Placard';
import PlacardButton from './PlacardButton';
import { Link } from 'react-router-dom';

type Props = {
  interestGroups: Array<any>,
};

const InterestgroupPlacard = ({ interestGroups }: Props) => {
  const YellowCircle = ({ className }: { className: string }) => (
    <div className={cx(styles.yellowCircle, className)}></div>
  );

  return (
    <Flex
      column
      justifyContent="space-between"
      alignItems="center"
      className={styles.container}
    >
      <Placard>
        <div className={styles.title}>INTERESSEGRUPPER</div>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          className={styles.groupsImages}
        >
          {interestGroups.slice(0, 3).map((interestGroup) => (
            <Link
              to={`interestgroups/${interestGroup.id}`}
              key={interestGroup.id}
            >
              <Image className={styles.groupImage} src={interestGroup.logo} />
            </Link>
          ))}
        </Flex>
        <PlacardButton to={'interestgroups'}>
          SJEKK UT INTERESSEGRUPPENE
        </PlacardButton>
      </Placard>
      <YellowCircle className={styles.circle1}></YellowCircle>
      <YellowCircle className={styles.circle2}></YellowCircle>
      <YellowCircle className={styles.circle3}></YellowCircle>
    </Flex>
  );
};

export default InterestgroupPlacard;

import styles from './InterestgroupCard.css';
import cx from 'classnames';

import Flex from '../../../components/Layout/Flex';
import { Image } from 'app/components/Image';
import BlankCard from './BlankCard';
import CardButton from './CardButton';
import { Link } from 'react-router-dom';

type Props = {
  interestGroups: Array,
};

const InterestgroupCard = ({ interestGroups }: Props) => {
  const YellowCircle = ({ className }) => (
    <div className={cx(styles.yellowCircle, className)}></div>
  );

  return (
    <Flex
      column
      justifyContent="space-between"
      alignItems="center"
      className={styles.container}
    >
      <BlankCard>
        <div className={styles.title}>INTERESSEGRUPPER</div>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          className={styles.groupsImages}
        >
          {interestGroups.map((interestGroup) => (
            <Link
              to={`interestgroups/${interestGroup.id}`}
              key={interestGroup.id}
            >
              <Image className={styles.groupImage} src={interestGroup.logo} />
            </Link>
          ))}
        </Flex>
        <CardButton to={'interestgroups'}>
          SJEKK UT INTERESSEGRUPPENE
        </CardButton>
      </BlankCard>
      <YellowCircle className={styles.circle1}></YellowCircle>
      <YellowCircle className={styles.circle2}></YellowCircle>
      <YellowCircle className={styles.circle3}></YellowCircle>
    </Flex>
  );
};

export default InterestgroupCard;

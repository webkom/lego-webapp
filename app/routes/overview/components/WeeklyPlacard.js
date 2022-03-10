// @flow

import type { Article } from 'app/models';

import moment from 'moment-timezone';

import Flex from 'app/components/Layout/Flex';
import PlacardButton from './PlacardButton';

import styles from './WeeklyPlacard.css';

import weeklyLogo from 'app/assets/weekly_logo.svg';
import weeklyMug from 'app/assets/weekly_mug.svg';

import { Image } from 'app/components/Image';
import Placard from './Placard';
import { Link } from 'react-router-dom';

type Props = {
  item: Article,
  url: string,
};

const WeeklyPlacard = ({ item, url }: Props) => {
  const WeeklyMug = ({ week }: { week: number }) => {
    return (
      <div className={styles.mug}>
        <Image src={weeklyMug} alt={week}></Image>
        <div>{week}</div>
      </div>
    );
  };

  const NewTag = () => (
    <div className={styles.newTag}>
      <div></div>
      <span>NY</span>
    </div>
  );

  const datePosted = moment(item ? item.createdAt : Date.now());
  const isNew = moment().diff(datePosted, 'day') < 5;
  // Subtract a few days in case weekly is out on monday next week
  const datePostedSafe = datePosted.subtract(2, 'day');
  return (
    <Flex
      column
      justifyContent="space-between"
      alignItems="center"
      className={`${styles.container} ${styles.weeklyWrapper}`}
    >
      <Placard>
        {/* {isNew && <NewTag />} */}
        <Link to="/articles?tag=weekly">
          <Flex alignItems="flex-start" className={styles.logoAndMug}>
            <Image src={weeklyLogo} alt="#WEEKLY" className={styles.logo} />
            <WeeklyMug week={datePostedSafe.week()} />
          </Flex>
        </Link>
        <div className={styles.description}>
          Se hva som har skjedd i Abakus denne uken, og hva som skjer fremover!
        </div>
        <PlacardButton to={url}>LES NYESTE</PlacardButton>
      </Placard>
    </Flex>
  );
};

export default WeeklyPlacard;

import { Article } from 'app/models';

import moment from 'moment-timezone';

import Flex from '../../../components/Layout/Flex';
import CardButton from './CardButton';

import styles from './WeeklyCard.css';

import weeklyLogo from 'app/assets/weekly_logo.svg';
import weeklyMug from 'app/assets/weekly_mug.svg';

import { Image } from 'app/components/Image';
import BlankCard from './BlankCard';

type Props = {
  item: Article,
  url: String,
};

const WeeklyCard = ({ item, url }: Props) => {
  const WeeklyMug = ({ week }) => {
    return (
      <div className={styles.mug}>
        <Image src={weeklyMug} alt={week}></Image>
        <p>{week}</p>
      </div>
    );
  };

  const NewTag = () => <div className={styles.newTag}>NY</div>;

  const date = moment(item ? item.createdAt : Date.now());
  // Subtract a few days in case weekly is out on monday next week
  let dateMargin = date.subtract(2, 'day');
  return (
    <Flex
      column
      justifyContent="space-between"
      alignItems="center"
      className={styles.container}
    >
      <BlankCard>
        <Flex alignItems="flex-start" className={styles.logoAndMug}>
          <Image src={weeklyLogo} alt="#WEEKLY" className={styles.logo} />
          <NewTag />
          <WeeklyMug week={dateMargin.week()} />
        </Flex>
        <div className={styles.description}>
          Se hva som har skjedd i Abakus denne uken, og hva som skjer fremover!
        </div>
        <CardButton to={url}>LES NYESTE</CardButton>
      </BlankCard>
      {/* <CardButton to="articles?tag=weekly" belowCard>
        FLERE WEEKLY's
      </CardButton> */}
    </Flex>
  );
};

export default WeeklyCard;

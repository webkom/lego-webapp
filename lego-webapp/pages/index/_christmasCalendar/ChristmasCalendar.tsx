import { Flex } from '@webkom/lego-bricks';
import styles from './ChristmasCalendar.module.css';

type ChristmasCalendarType = {
  className: string;
};

const ChristmasCalendar = ({ className }: ChristmasCalendarType) => {
  return (
    <div className={className}>
      <Flex>
        <AbakusPole/>
        <AbakusPole/>
      </Flex>
    </div>
  );
};

const AbakusPole = () => {
  return(
    <Flex column alignItems='center'>
      <div className={styles.abakusPole}/>
      <div className={styles.abakusBrick}/>
    </Flex>
  )
}

export default ChristmasCalendar;

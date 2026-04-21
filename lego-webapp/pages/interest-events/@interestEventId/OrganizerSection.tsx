import { Flex } from '@webkom/lego-bricks';
import boxStyles from './boxes.module.css';
import styles from './organizerSection.module.css';

export const OrganizerSection = () => {
  return (
    <div className={boxStyles.rightInfoBox}>
      <Flex justifyContent={'space-between'} width={'100%'}>
        <div>Arrangør</div>
        <div>Fagkom</div>
      </Flex>
      <Flex justifyContent={'space-between'} width={'100%'}>
        <div>Kontakt</div>
        <ul className={styles.organizerList}>
          <li>Filip grøtulf filipsen</li>
          <li>Ben ten bendiksen</li>
        </ul>
      </Flex>
    </div>
  );
};

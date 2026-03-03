import { Flex } from '@webkom/lego-bricks';
import { ChevronRight } from 'lucide-react';
import styles from './adminSection.module.css';
import boxStyles from './boxes.module.css';

export const AdminSection = () => {
  return (
    <div className={boxStyles.rightInfoBox}>
      <Flex
        className={styles.adminTop}
        justifyContent={'space-between'}
        alignItems={'center'}
        width={'100%'}
      >
        <div className={boxStyles.title}>ADMIN</div>
        <ChevronRight className={styles.arrowIcon} />
      </Flex>
    </div>
  );
};

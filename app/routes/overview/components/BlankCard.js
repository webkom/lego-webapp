import cx from 'classnames';
import styles from './BlankCard.css';

import Flex from '../../../components/Layout/Flex';

type Props = {
  children: any,
  className?: String,
  centered?: Boolean,
};

const BlankCard = ({ children, className, row, justifyContent }) => {
  return (
    <Flex
      column={row ? false : true}
      alignItems="center"
      justifyContent={justifyContent ? justifyContent : 'space-between'}
      className={cx(styles.whitebox, className)}
    >
      {children}
    </Flex>
  );
};

export default BlankCard;

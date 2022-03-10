//@flow

import cx from 'classnames';
import styles from './Placard.css';

import Flex from 'app/components/Layout/Flex';

type Props = {
  children: any,
  className?: string,
  row?: boolean,
  justifyContent?: any,
};

const Placard = ({ children, className, row, justifyContent }: Props) => {
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

export default Placard;

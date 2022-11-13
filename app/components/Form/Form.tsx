import cx from 'classnames';
import styles from './Form.css';
import type { ReactNode, HTMLAttributes } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLFormElement>;

function Form({ children, className, ...props }: Props) {
  return (
    <form className={cx(styles.form, className)} {...props} method="post">
      {children}
    </form>
  );
}

export default Form;

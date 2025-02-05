import cx from 'classnames';
import styles from './Form.module.css';
import type { ReactNode, FormHTMLAttributes } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

function Form({
  children,
  className,
  ...props
}: Props & FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className={cx(styles.form, className)} {...props} method="post">
      {children}
    </form>
  );
}

export default Form;

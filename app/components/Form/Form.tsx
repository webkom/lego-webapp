import cx from 'classnames';
import styles from './Form.css';

type Props = {
  children: any;
  className?: string;
};

function Form({ children, className, ...props }: Props) {
  return (
    <form
      className={cx(styles.form, className)}
      {...(props as Record<string, any>)}
      method="post"
    >
      {children}
    </form>
  );
}

export default Form;

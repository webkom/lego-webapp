import styles from './CardButton.css';
import cx from 'classnames';

import { Link } from 'react-router-dom';
import Context from 'react-redux/lib/components/Context';

type Props = {
  to: ?String,
  href: ?String,
  belowCard: Boolean,
  children: any[],
};

const CardButton = ({ to, href, belowCard, children }: Props) => {
  const content = (
    <div
      className={cx(
        styles.button,
        belowCard ? styles.belowCard : styles.inCard
      )}
    >
      {children}
    </div>
  );
  return (
    <>
      {href ? (
        <a href={href}>{content}</a>
      ) : to ? (
        <Link to={to}>{content}</Link>
      ) : null}
    </>
  );
};

export default CardButton;

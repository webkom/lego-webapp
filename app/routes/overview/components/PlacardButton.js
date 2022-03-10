//@flow

import styles from './PlacardButton.css';
import cx from 'classnames';

import { Link } from 'react-router-dom';

type Props = {
  to?: string,
  href?: string,
  belowCard?: boolean,
  children: string,
};

const PlacardButton = ({ to, href, belowCard, children }: Props) => {
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
  return href ? (
    <a href={href}>{content}</a>
  ) : to ? (
    <Link to={to}>{content}</Link>
  ) : null;
};

export default PlacardButton;

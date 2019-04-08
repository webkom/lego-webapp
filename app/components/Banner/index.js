// @flow

import React, { Component } from 'react';
import styles from './Banner.css';
import cx from 'classnames';
import { Link } from 'react-router-dom';

type Props = {
  /** Text of banner */
  text: string,

  /** The banner can be a link */
  link?: string,

  /** Make banner abared */
  red?: boolean,

  /** Make banner white */
  white?: boolean,

  /** Make banner black */
  black?: boolean
};

class Banner extends Component<Props, *> {
  render() {
    const { text, link, red, white, black } = this.props;
    return (
      <div>
        {link ? (
          <Link to={link}>
            <div
              className={cx(
                styles.header,
                red && styles.red,
                white && styles.white,
                black && styles.black
              )}
            >
              {text}
            </div>
          </Link>
        ) : (
          <div
            className={cx(
              styles.header,
              red && styles.red,
              white && styles.white,
              black && styles.black
            )}
          >
            {text}
          </div>
        )}
        ;
      </div>
    );
  }
}

export default Banner;

import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import styles from './Tag.css';

export default class Tag extends Component {

  render() {
    const { tag, small } = this.props;
    let className = small ? styles.tagLinkSmall : styles.tagLink;

    return (
      <div className={styles.linkSpacing}>
        <Link className={className} to={`/`}>
          #{ tag }
        </Link>
      </div>
    );
  }
}

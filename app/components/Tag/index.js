import React, { Component } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import styles from './Tag.css';

export default class Tag extends Component {

  render() {
    const { tag } = this.props;

    let className = styles.tagLink;

    return (
      <div>
        <Link className={className} to={`/`}>
          #{ tag }
        </Link>
      </div>
    );
  }
}

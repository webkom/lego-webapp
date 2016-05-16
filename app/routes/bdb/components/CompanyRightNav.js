import React, { Component } from 'react';
import styles from './bdb.css';
import { Link } from 'react-router';

export default class CompanyRightNav extends Component {

  render() {
    return (
      <div className={styles.rightSection}>
        <Link to='/bdb/add'>Legg til bedrift</Link>
      </div>
    );
  }
}

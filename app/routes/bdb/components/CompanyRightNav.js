import React, { Component } from 'react';
import styles from './bdb.css';
import { Link } from 'react-router';

type Props = {
  companyId: string
};

export default class CompanyRightNav extends Component {

  props: Props;

  render() {
    return (
      <div className={styles.rightSection}>
        <Link to='/add'>Legg til bedrift</Link>
        <Link to={'/edit'}>Endre bedrift</Link>
      </div>
    );
  }
}

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
        <Link to={`/bdb/${this.props.companyId}`}>Til bedriftens side</Link>
        <Link to='/bdb/add'>Legg til bedrift</Link>
        <Link to={`/bdb/${this.props.companyId}/edit`}>Endre bedrift</Link>
      </div>
    );
  }
}

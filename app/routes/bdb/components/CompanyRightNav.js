import React, { Component, PropTypes } from 'react';
import styles from './bdb.css';
import { Link } from 'react-router';

export default class CompanyRightNav extends Component {

  static propTypes = {
    companyId: PropTypes.string.isRequired
  };

  render() {
    const { companyId } = this.props;

    return (
      <div className={styles.rightSection}>
        <Link to='/bdb/add'>Legg til bedrift</Link>
        <Link to={`bdb/${companyId}/edit`}>Endre bedrift</Link>
      </div>
    );
  }
}

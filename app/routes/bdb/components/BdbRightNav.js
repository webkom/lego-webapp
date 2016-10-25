import React, { Component } from 'react';
import styles from './bdb.css';
import { Link } from 'react-router';

type Props = {
  companyId: string
};

export default class BdbRightNav extends Component {

  props: Props;

  render() {
    return (
      <div className={styles.rightSection}>
        {this.props.companyId && (
          <div>
            <Link to={`/bdb/${this.props.companyId}`}>Til bedriftens side</Link>
            <Link to={`/bdb/${this.props.companyId}/edit`}>Endre bedrift</Link>
          </div>
        )}
        <Link to='/bdb/add'>Legg til bedrift</Link>
      </div>
    );
  }
}

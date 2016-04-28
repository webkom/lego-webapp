import React, { Component, PropTypes } from 'react';
import CompanyList from './CompanyList';
import styles from './bdbPage.css';

export default class BdbPage extends Component {

  static propTypes = {
    companies: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className={`u-container ${styles.root}`}>

        <h1>Bedriftsdatabase</h1>

          <CompanyList
            {...this.props}
          />

      </div>
    );
  }
}

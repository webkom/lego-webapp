import React, { Component, PropTypes } from 'react';
import CompanyList from './CompanyList';

export default class BdbPage extends Component {

  static propTypes = {
    companies: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className='u-container bdb-container'>

          <CompanyList
            {...this.props}
          />

      </div>
    );
  }
}

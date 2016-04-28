import React, { Component, PropTypes } from 'react';
import './bdbPage.css';

export default class CompanyList extends Component {

  static propTypes = {
    companies: PropTypes.array.isRequired
  };

  render() {
    const { companies } = this.props;
    return (
      <div className='company-list'>
        <ul className='category-header'>
          <li>Bedrifter</li>
          <li>Høst 2016</li>
          <li>Vår 2017</li>
          <li>Høst 2017</li>
          <li>Vår 2018</li>
          <li>Studentkontakt</li>
          <li>Kommentar</li>
        </ul>
        <ul>
          {companies.map((company) =>
            <ul>
              <li>{company.name}</li>
              <li>{company.contacted[0]}</li>
              <li>{company.contacted[1]}</li>
              <li>{company.contacted[2]}</li>
              <li>{company.contacted[3]}</li>
              <li>{company.studentContact}</li>
              <li>{company.comment}</li>
            </ul>
          )}
        </ul>
      </div>
    );
  }
}

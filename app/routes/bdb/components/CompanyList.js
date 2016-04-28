import React, { Component, PropTypes } from 'react';
import styles from './bdbPage.css';

export default class CompanyList extends Component {

  static propTypes = {
    companies: PropTypes.array.isRequired
  };

  render() {
    const { companies } = this.props;
    return (

      <div className={styles.companyList}>

      <table>
        <thead className={styles.categoryHeader}>
          <tr>
            <th>Bedrifter</th>
            <th>Høst 2016</th>
            <th>Vår 2017</th>
            <th>Høst 2017</th>
            <th>Vår 2018</th>
            <th>Studentkontakt</th>
            <th>Kommentar</th>
          </tr>
        </thead>

        <tbody>
            {companies.map((company) =>
              <tr>
                <td>{company.name}</td>
                <td>{company.contacted[0]}</td>
                <td>{company.contacted[1]}</td>
                <td>{company.contacted[2]}</td>
                <td>{company.contacted[3]}</td>
                <td>{company.studentContact}</td>
                <td>{company.comment}</td>
              </tr>
            )}
        </tbody>

      </table>

      </div>
    );
  }
}
